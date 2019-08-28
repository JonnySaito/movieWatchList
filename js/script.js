// console.log('js is loading nice and nicely');
let serverURL;
let serverPort;
let url;
let editing = false;

// Get the json file
$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}}`
    // console.log('server connection is OK');
    getMovieData();
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});

// Get all the movies
getMovieData = () => {
    // console.log(`${serverURL}:${serverPort}/allMovies`);
    console.log(url);
    $.ajax({
        url: `${serverURL}${serverPort}/allMovies`,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            for (var i = 0; i < data.length; i++) {
                $('#movieList').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${data[i]._id}">
                        <span class="movieName">${data[i].name}</span>
                        <div>
                            <button class="btn btn-warning editBtn">Edit</button>
                            <button class="btn btn-danger removeBtn">Remove</button>
                        </div>
                    </li>
                `);
            }
        }
    })
}

//Add or Edit a movie
$('#addMovieButton').click(function(){
    event.preventDefault();
    let movieName = $('#movieName').val();
    let moviePrice = $('#moviePrice').val();
    if(movieName.length === 0){
        console.log('please enter a movies name');
    } else if(moviePrice.length === 0){
        console.log('please enter a movies price');
    } else {
        if(editing === true){
            const id = $('#movieID').val();
            $.ajax({
                url: `${url}/movie/${id}`,
                type: 'PATCH',
                data: {
                    title: movieName,
                    director: movieDirector,
                    genre: movieGenre,
                    year: movieYear
                },
                success:function(result){
                    $('#movieName').val(null);
                    $('#movieDirector').val(null);
                    $('#movieGenre').val(null);
                    $('#movieYear').val(null);
                    $('#movieID').val(null);
                    $('#addMovieButton').text('Add New Movie').removeClass('btn-warning');
                    $('#heading').text('Add New Movie');
                    editing = false;
                    const allMovies = $('.movieItem');
                    allMovies.each(function(){
                        if($(this).data('id') === id){
                            $(this).find('.movieName').text(movieName);
                        }
                    });
                },
                error: function(err){
                    console.log(err);
                    console.log('Something went wrong with editing the movie');
                }
            })
        } else {
            $.ajax({
                url: `${url}/movie`,
                type: 'POST',
                data: {
                  title: movieName,
                  director: movieDirector,
                  genre: movieGenre,
                  year: movieYear
                },
                success:function(result){
                    $('#movieName').val(null);
                    $('#movieDirector').val(null);
                    $('#movieGenre').val(null);
                    $('#movieYear').val(null);
                    $('#movieList').append(`
                        <li class="list-group-item d-flex justify-content-between align-items-center movieItem">
                            <span class="movieName">${result.name}</span>
                            <div>
                                <button class="btn btn-info editBtn">Edit</button>
                                <button class="btn btn-danger removeBtn">Remove</button>
                            </div>
                        </li>
                    `);
                },
                error: function(error){
                    console.log(error);
                    console.log('something went wrong with sending the data');
                }
            })
        }

    }
})

// Edit button to fill the form with exisiting movie
$('#movieList').on('click', '.editBtn', function() {
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    $.ajax({
        url: `${url}/movies/${id}`,
        type: 'get',
        dataType: 'json',
        success:function(movie){
            $('#movieName').val(movie['name']);
            $('#moviePrice').val(movie['price']);
            $('#movieID').val(movie['_id']);
            $('#addMovieButton').text('Edit Movie').addClass('btn-warning');
            $('#heading').text('Edit Movie');
            editing = true;
        },
        error:function(err){
            console.log(err);
            console.log('something went wrong with getting the single movie');
        }
    })
});

// Remove a movie
$('#movieList').on('click', '.removeBtn', function(){
    event.preventDefault();
    const id = $(this).parent().parent().data('id');
    const li = $(this).parent().parent();
    $.ajax({
      url: `${url}/movie/${id}`,
      type: 'DELETE',
      success:function(result){
        li.remove();
      },
      error:function(err) {
        console.log(err);
        console.log('something went wrong deleting the movie');
      }
    })
});
