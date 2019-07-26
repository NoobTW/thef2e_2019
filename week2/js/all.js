$(function() {
	let i = 1;
	let arr = Array(52).fill(0).map(x => x + (i++)).sort(() => Math.random() - 0.5).map(x => x.toString().padStart(2, '0'));
	console.log(arr);
	$('.cardDeck .card').each((i, x) => {
		const img= `url('./card/card_${arr[i]}.png');`;
		console.log(img);
		console.log(x);
		x.style.backgroundImage = 'gay';
		$(x).attr('style', `background-image:${img}`);
	});
});
