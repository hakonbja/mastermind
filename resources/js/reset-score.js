function resetScore() {
	localStorage.removeItem('greentries');
	localStorage.removeItem('greentimer');
	localStorage.removeItem('redtries');
	localStorage.removeItem('redtimer');
	$('#status').html('High score reset.')
	console.log("High score reset.");
}
