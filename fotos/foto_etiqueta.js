//Definimos variables globales
var click;
var move;
var x_centrado;
var y_centrado;
var etiqueta_editar;

function etiqueta_borrar(label, value) {
	if (etiqueta_editar != 1)
		return false;
	//lo borramos del panel etiquetado
	$("#lista_etiquetados").find("li").each(function() {
		if ($(this).text() == label) {
			$(this).remove();
		}
	});

	lista_amigos.push({value : value,label : label});

	// buscamos el nombre del amigo seleccionado
	for ( i = 0; i < lista_etiquetados.length; i++) {
		if (lista_etiquetados[i].label == label) {
			lista_etiquetados.splice(i, 1);
			// y lo quitamos del array
			break;
		}
	}
	$("#etiqueta_"+value).remove();
	
}

function post(lista_etiquetados) {
	string_envio = "";
	for ( i = 0; i < lista_etiquetados.length; i++) {
		string_envio += lista_etiquetados[i].value + ",";
		string_envio += lista_etiquetados[i].x + ",";
		string_envio += lista_etiquetados[i].y + ",";
	}
	string_envio = string_envio.substring(0, string_envio.length - 1);
	ajax_post("post.php", "foto_etiquetado=1&idfoto=" + idfoto + "&etiquetas=" + string_envio);
	location.reload();
}

function etiqueta_editar() {
	$("#lista_etiquetados li div").css("display","inline-block");
	etiqueta_editar = 1;
	$("form button").show();
	//TODO: cambiar visual lista etuiquetados
	move = 1;
	onclick = $("#foto").attr("onclick");
	//desactivamos click
	$("#foto").removeAttr("onclick");

	$("#foto_marco").mouseenter(function(e) {
		etiqueta_crear();
		$("#foto_marco").mousemove(function(e) {
			if (move == 1) {
				fl = this.offsetLeft;
				fr = this.offsetLeft + parseInt($(this).css("width").match(/[0-9]{1,}/gi)[0]);
				ft = this.offsetTop;
				fb = this.offsetTop + parseInt($(this).css("height").match(/[0-9]{1,}/gi)[0]);

				//raton fuera de la foto
				if (e.pageX < fl || e.pageX > fr || e.pageY < ft || e.pageY > fb) {
					$("#etiqueta").hide();
				}
				//alert(e.pageX);
				var p = $("#foto").position();
				//$("p:last").text( "left: " + position.left + ", top: " + position.top );

				//Coordenadas de la etuiqueta
				x = e.pageX - this.offsetLeft;
				y = e.pageY - this.offsetTop;
			

			//Coordenadas de la etuiqueta centrada al raton
			h = $("#etiqueta").css("height").match(/[0-9]{1,}/gi)[0] / 2;
			w = $("#etiqueta").css("width").match(/[0-9]{1,}/gi)[0] / 2;
			y_centrado = y + p.top - h + "px";
			x_centrado = x + p.left - w + "px";
			$("#etiqueta").css({
				"top" : y_centrado,
				"left" : x_centrado
			});
}
			$("#coors1").text("DIV x: " + x + " y: " + y);
			$("#coors2").text("DIV CENTRADO x: " + x_centrado + " y: " + y_centrado);
		});

		$("#etiqueta").click(function(e) {
			move = 0;
			click = 1;
			$("form,form input").show();
			$("form #tags").focus();
		});

		$("#foto").click(function(e) {//si click=1 y pincha fuera de la etiqueta desparaliza etiqueta
			if (move == 0 && click == 1) {
				move = 1;
				click = 0;
				$("form input,label").show();
				$("form #tags").focus();
			}
		});

	});
}

function etiqueta_fijar(id,name) {
	$("#foto_marco").append("<div class='etiquetado etiqueta_"+id+"' id='etiqueta_"+id+"' style='left:" + x_centrado + ";top:" + y_centrado + ";'><div class='etiqueta_nombre'>"+name+"</div></div>");
	$("form input").hide();
	$("body").focus();
	move = 1;
	click = 0;
}

function etiqueta_crear() {
	if ($("#etiqueta").length < 1) {
		$("#foto_marco").append("<div id='etiqueta'></div>");
	} else if (click != 1) {
		move = 1;
		$("#etiqueta").show();
	}
}


$(document).ready(function() {
});

//elimina gente etiquetada del la lista_amigos
function amigos_actualizar() {
	$("#lista_etiquetados li div").each(function() {
		//alert($(this).attr('onclick').match(/'[0-9]{1,}'/gim)[0]);
		id = $(this).attr('onclick').match(/'[0-9]{1,}'/gim)[0].match(/[0-9]{1,}/gim)[0];
		//alert(id);
		// buscamos el nombre del amigo seleccionado
		for ( i = 0; i < lista_amigos.length; i++) {
			if (lista_amigos[i].value == id) {
				lista_amigos.splice(i, 1);
				// y lo quitamos del array
				break;
			}
		}
	});
}

$(function() {
	$("#tags").autocomplete({
		minLength : 0,
		source : lista_amigos,
		create : function(event, ui) {
			amigos_actualizar();
			//elimina gente etiquetada del select
			return false;
		},
		focus : function(event, ui) {
			//al focus sobre un resultado
			$("#tags").val(ui.item.label);
			return false;
		},
		select : function(event, ui) {
			//AL PULSAR UN RESULTADO
			//lo añadimos a los etiquetados
			lista_etiquetados.push({value : ui.item.value,label : ui.item.label,x : x_centrado,y : y_centrado});
			$("#lista_etiquetados").append("<li class='etiqueta_"+id+"'>" + ui.item.label + "<div onclick=\"etiqueta_borrar('" + ui.item.label + "','" + ui.item.value + "')\" style='display:inline-block;'></div></li>");
			$("#tags").val("");

			// buscamos el nombre del amigo seleccionado
			for ( i = 0; i < lista_amigos.length; i++) {
				if (lista_amigos[i].label == ui.item.label) {
					lista_amigos.splice(i, 1);
					// y lo quitamos del array
					break;
				}
			}

			//efectos de raton y divs
			etiqueta_fijar(ui.item.value,ui.item.label);
			return false;
		}
	}).data("autocomplete")._renderItem = function(ul, item) {
		return $("<li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
	};
}); 