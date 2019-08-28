// console.log('js is loading nice and nicely');
let serverURL;
let serverPort;
// let editing = false;

$.ajax({
  url: 'config.json',
  type: 'GET',
  dataType: 'json',
  success:function(keys){
    serverURL = keys['SERVER_URL'];
    serverPort = keys['SERVER_PORT'];
    // console.log('server connection is OK');
    getMovieData();
  },
  error: function(){
    console.log('cannot find config.json file, cannot run application');
  }
});

getMovieData = () => {
    console.log(`${serverURL}:${serverPort}/allMovies`);
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
