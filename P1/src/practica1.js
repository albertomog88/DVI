"use strict";



var MemoryGame = function(gs) {

	this.gs = gs;
	this.numEncontradas = 0;//8parejas
	this.mensajeEstado = "";
	
	//: Inicializa el juego creando las cartas (recuerda que son 2 de cada
	//tipo de carta), desordenándolas y comenzando el bucle de juego.
	this.initGame = function(){
		
		this.caratulas = [
			new MemoryGameCard("perico"),
			new MemoryGameCard("mortadelo"),
			new MemoryGameCard("fernandomartin"),
			new MemoryGameCard("sabotaje"),
			new MemoryGameCard("phantomas"),
			new MemoryGameCard("poogaboo"),
			new MemoryGameCard("sevilla"),
			new MemoryGameCard("abadia"),
			//new MemoryGameCard("back"), //Carta boca abajo!
			new MemoryGameCard("perico"),
			new MemoryGameCard("mortadelo"),
			new MemoryGameCard("fernandomartin"),
			new MemoryGameCard("sabotaje"),
			new MemoryGameCard("phantomas"),
			new MemoryGameCard("poogaboo"),
			new MemoryGameCard("sevilla"),
			new MemoryGameCard("abadia"),
			//new MemoryGameCard("back")
		];

		//Desordenar baraja (PARA PRUEBAS COMENTAMOS)
		this.caratulas.sort(function() { return Math.random() - 0.5 });
		
		//Cargar sprite inicial.
		this.mensajeEstado = "Bienvenido a Memory Card";
		this.loop();

	}

	// 	Es el bucle del juego. En este caso es muy sencillo: llamamos al método
	// draw cada 16ms (equivalente a unos 60fps). Esto se realizará con la función
	// setInterval de Javascript.
	
	this.loop = function(){
		var that = this;
		//https://developer.mozilla.org/es/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
		setInterval(function(){	
			that.draw();
		}, 
		16); //16 Milisegundos de refresco
	}


	// 	Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual del
	// juego y (2) pide a cada una de las cartas del tablero que se dibujen.
	this.draw = function(){
		
		gs.drawMessage(this.mensajeEstado);
		for(var i = 0;i < this.caratulas.length ; i++)
			this.caratulas[i].draw(this.gs, i);
	}

	this.pareja = undefined;//Nombre de la carta
	this.idCardPar = undefined;

	this.onClick = function(cardId){
		this.statusCard_Game(cardId);//COMPROBACION
		if(cardId != undefined //Si no es undefined
			&& this.caratulas[cardId].status().std!=0 //Si no ha sido encontrada
			&& this.caratulas[cardId].status().std!=1){ // Si no esta bocarriba

				this.caratulas[cardId].flip();//Volteamos carta
				this.mensajeBox("b", undefined, undefined);
				if(this.pareja!= undefined){//Si hay alguna carta sin pareja comprobamos
					if(!this.caratulas[cardId].compareTo(this.pareja) ){
						this.mensajeBox("np", this.pareja, this.caratulas[cardId].nombre);
						var that = this;
						setTimeout( function(){
							that.caratulas[cardId].flip();
							that.caratulas[that.idCardPar].flip();//PROBLEMAS POR QUE LE PASO UN ID
							that.cartaVolteada = undefined;
							that.pareja = undefined;
							that.idCardPar = undefined;
							}, 
						650);
					}
					else{ //No hay pareja, damos la vuelta y des
						//Marcamos las cartas como encontradas
						this.caratulas[cardId].found();
						this.caratulas[this.idCardPar].found();
						//Aumentamos contador de parejas
						this.numEncontradas++;//MAX 8 PAREJAS
						//this.mensajeEstado = this.pareja + " pareja encontrada!";
						this.mensajeBox("p", this.pareja, undefined);
						this.pareja = undefined; //Desmarcamos
						
						if(this.numEncontradas == 8){
							//this.mensajeEstado ="GANASTE!";
							this.mensajeBox("w", undefined, undefined);
							// var nuevo = confirm("¿Desea jugar de nuevo?");
							// nuevo ? location.reload():this.mensajeEstado="Fin del juego";
						}
					}
				}
				else{
					this.pareja = this.caratulas[cardId].nombre; //Si no guardamos la pareja para iteraciones siguientes
					this.idCardPar = cardId;
				} 
		}
	}

	

	
	this.mensajeBox = function(opt, cardWin, cardPar){
		console.log("booox");
		if(opt=="w"){
			let msnWin = [
				"“Si puedes aceptar perder, puedes ganar”",
				"“Nunca pierdo, o gano o aprendo”",
				"“A veces ganas y a veces aprendes”",
				"“La diferencia entre ganar y perder es no renunciar”"
			];
			msnWin.sort(function() { return Math.random() - 0.5 });
			this.mensajeEstado = "WIN! "+msnWin[0];
		}
		else if(opt=="p" && cardWin!=undefined){
			let pareja = [
				"Carta "+ cardWin + " ha encontrado a su media naranja", 
				"Carta "+ cardWin + " con pareja!",
				"Pareja encontrada!"
			];
			pareja.sort(function() { return Math.random() - 0.5 });
			this.mensajeEstado = pareja[0];
		}
		else if(opt=="np"){
			let no_pareja = [
				cardWin + " y "+ cardPar+ " no son pareja",
				"Sigue buscando",
				cardWin + " y "+ cardPar+ " no son iguales"
			];
			no_pareja.sort(function() { return Math.random() - 0.5 });
			this.mensajeEstado = no_pareja[0];
		}
		else if(opt=="b"){
			let buscando = [
				"Buscando pareja",
				"Sondeando cartas",
				"Continua buscando", 
				"¿Donde esta esa carta?",
				"No te escondas"
			];
			buscando.sort(function() { return Math.random() - 0.5 });
			this.mensajeEstado = buscando[0];
		}
	}
	

	this.statusCard_Game = function(cardId){
		console.log("Carta id: "+ cardId);
		console.log("Carta Actual: "+this.caratulas[cardId].nombre);
		console.log("???? "+this.caratulas[cardId].pos);
		
		console.log("Estado Carta Actual: "+this.caratulas[cardId].status().std);
		console.log("Num Parejas encontradas: "+this.numEncontradas);
		console.log("Carta guardada: "+this.pareja);
	
	}

}

var STATUS_COVER = {
	ARRIBA: {name:" Caratula boca arriba", std: 1}, 
	OCULTA:{name:" Caratula oculta", std: -1}, 
	ENCONTRADA:{name:" Pareja encontrada", std: 0}
};

var MemoryGameCard = function(sprite) {

	//console.log("SPRITE "+ sprite);
	this.nombre = sprite;
	this.statusCover = STATUS_COVER.OCULTA;//Inicial de cada carta
	

	//Da la vuelta a la carta, cambiando el estado de la misma
	this.flip = function(){
		switch (this.statusCover) {

			case STATUS_COVER.ARRIBA:
				this.statusCover = STATUS_COVER.OCULTA;
			break;
			case STATUS_COVER.OCULTA:
				this.statusCover = STATUS_COVER.ARRIBA;
			break;
			
		}
	}

	//Cover encontrado
	this.found = function(){
		this.statusCover = STATUS_COVER.ENCONTRADA;
	}


	//Cover iguales?
	this.compareTo = function(cover){
		//(this.nombre == cover) ? this.mensajeEstado = this.nombre + " pareja encontrada!":	this.textoEstado = this.nombre +" y "+ cover+" no son pareja.";
		/*if(this.nombre == cover){
			this.mensajeEstado = this.nombre + " pareja encontrada!";
		}
		else{
			this.mensajeEstado = this.nombre +" y "+ cover+" no son pareja.";
		}*/
		return this.nombre == cover;
	}

	/*Dibuja la carta de acuerdo al estado en el que se encuentra.
	Recibe como parámetros el servidor gráfico y la posición en la que se encuentra en
	el array de cartas del juego (necesario para dibujar una carta)*/
	this.draw = function(gs, pos){
		if(this.statusCover == STATUS_COVER.OCULTA){
			gs.draw('back', pos);
		}
		else{
			gs.draw(this.nombre, pos);
		}
	}

	this.status = function(){
		return this.statusCover;
	}


}