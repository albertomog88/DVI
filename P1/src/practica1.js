"use strict";

console.log( "Practica 1");

//var MemoryGame = MemoryGame;

var MemoryGame = function(gs) {

	this.gs = gs;
	//this.caratulas = new Array(16);
	this.numEncontradas = 0;//8parejas
	this.mensajeEstado = "";
	
	//: Inicializa el juego creando las cartas (recuerda que son 2 de cada
	//tipo de carta), desordenándolas y comenzando el bucle de juego.
	this.initGame = function(){
		console.log("Iniciando Juego");

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
		//this.caratulas.sort(function() { return Math.random() - 0.5 });
		
		//Cargar sprite inicial.
		this.mensajeEstado = "Bienvenido a Memory Card";
		this.loop();

	}

	// 	Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual del
	// juego y (2) pide a cada una de las cartas del tablero que se dibujen.
	this.draw = function(){
		console.log("Pintando");
		
		gs.drawMessage(this.mensajeEstado);
		var i = 0;
		for(i ;i < this.caratulas.length ; i++)
			this.caratulas[i].draw(this.gs, i);
	}

	// 	Es el bucle del juego. En este caso es muy sencillo: llamamos al método
	// draw cada 16ms (equivalente a unos 60fps). Esto se realizará con la función
	// setInterval de Javascript.
	
	this.loop = function(){
		console.log("bucle");
		var that = this;
		//https://developer.mozilla.org/es/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
		setInterval(function(){	
			that.draw();
		}, 
		16); //16 Milisegundos de refresco
	}
	this.reinicio;
	this.pareja = undefined;//Nombre de la carta
	this.idCardPar = undefined;

	this.onClick = function(cardId){
		console.log("onclick");
		//this.mensajeEstado = this.caratulas[cardId].nombre;
		this.statusCard_Game(cardId);//COMPROBACION
		if(cardId != undefined //Si no es undefined
			&& this.caratulas[cardId].status().std!=0 //Si no ha sido encontrada
			&& this.caratulas[cardId].status().std!=1){ // Si no esta bocarriba

				this.caratulas[cardId].flip();//Volteamos carta
				
				if(this.pareja!= undefined){//Si hay alguna carta sin pareja comprobamos
					console.log('Comprobamos si la prajera es correcta!');
					if(!this.caratulas[cardId].compareTo(this.pareja) ){
						
						console.log('No hay pareja');
						//PROBLEMAS PARA PINTAR MENSAJE!!!!!!
						//this.textoEstado = this.caratulas[cardId].nombre +" y "+ this.pareja+" no son pareja.";
						var that = this;
						setTimeout( function(){
							console.log('DENTRO '+cardId);
							that.caratulas[cardId].flip();
							that.caratulas[that.idCardPar].flip();//PROBLEMAS POR QUE LE PASO UN ID
							that.cartaVolteada = undefined;
							that.pareja = undefined;
							that.idCardPar = undefined;
							
						}, 1000);
						
						// console.log('Carta encontrada!');
						
					}
					else{ //No hay pareja, damos la vuelta y des
						console.log('Carta  encontrada!');
						this.parejaEncontrada(cardId, this.idCardPar);
						
						
						this.numEncontradas++;//MAX 8 PAREJAS
						this.mensajeEstado = this.pareja + " pareja encontrada!";
						this.pareja = undefined; //Desmarcamos
						
						if(this.numEncontradas == 8){
							this.numEncontradas = "Ganaste!";
							//FIN DE LA PARTIDA IDEAS
							//SISTEMA DE PUNTUACIONES, ?? COMPLICARSE
							//OPCION A REINICIAR JUEGO?
							console.log('GANASTE!');
							this.mensajeEstado ="GANASTE!";
							var nuevo = confirm("¿Desea juegar de nuevo?");
							nuevo ? location.reload():this.mensajeEstado="Fin del juego";
						}
					}
				}
				else{
					this.pareja = this.caratulas[cardId].nombre; //Si no guardamos la pareja para iteraciones siguientes
					this.idCardPar = cardId;
				} 
		}
	}

	this.parejaEncontrada = function(cardID1, cardID2){
		this.caratulas[cardID1].found();
		this.caratulas[cardID2].found();
		//this.mensajeEstado = this.caratulas[cardID1].nombre + " pareja encontrada!";
		//DAR MENSAJE DE EL NOMBRE DE LA PAREJA ENCONNTRADO O SIMILAR
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