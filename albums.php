<?php
require ("verify_login.php");
head("Buscador - Social");
require ("estructura.php");
?>
<div class="barra_full">
	<?php

	//Albums de fotos de ¿?
	if (!$_GET['iduser']) {
		$_GET['iduser'] = $global_idusuarios;
		$user = 'yo';
		echo "<h2 style='margin-bottom:0px;'>Mis Albums de imagenes</h2>";
	} else {
		$usuario = mysql_query("SELECT * FROM usuarios WHERE idusuarios='" . $_GET['iduser'] . "'");
		if (mysql_num_rows($usuario) > 0) {
			$row = mysql_fetch_assoc($usuario);
			echo "<h2 style='margin-bottom:0px;'>Albums de imagenes de " . $row['nombre'] . "</h2>";
		}
	}

	//Subidas
	echo "<div class='album'><div class='album_titulo'><a href='fotos.php?iduser=" . $_GET['iduser'] . "&idalbum=subidas'>Fotos subidas</a></div>";
	$fotos = mysql_query("SELECT * FROM fotos WHERE uploader='" . $_GET['iduser'] . "' ORDER BY idfotos DESC LIMIT 3");
	if (mysql_num_rows($fotos)) {
		$bottom = 0;
		$left = 0;
		while ($row = mysql_fetch_assoc($fotos)) {
			echo "<a href='fotos.php?iduser=" . $_GET['iduser'] . "&idalbum=subidas'><img class='album_cubierta' style='bottom:" . $bottom . "px;left:" . $left . "px;max-width:" . $width . "px;max-height:" . $height . "px;' alt='cubierta album' src='" . $row['archivo'] . "' /><br></a>";

			$bottom = $bottom + 90;
			$left = $left + 90;
		}
	} else {
		echo "No has subido ninguna foto";
	}
	echo "</div>";

	//Etiquetadas
	echo "<div class='album'><div class='album_titulo'><a href='fotos.php?iduser=" . $_GET['iduser'] . "&idalbum=etiquetadas'>Fotos etiquetadas</a></div>";
	$fotos = mysql_query("SELECT * FROM fotos, etiquetas WHERE usuarios_idusuarios = '" . $_GET['iduser'] . "' AND idfotos = fotos_idfotos ORDER BY idfotos LIMIT 3");
	if (mysql_num_rows($fotos)) {
		$bottom = 0;
		$left = 0;
		while ($row = mysql_fetch_assoc($fotos)) {
			echo "<a href='fotos.php?iduser=" . $_GET['iduser'] . "&idalbum=etiquetadas'><img class='album_cubierta' style='bottom:" . $bottom . "px;left:" . $left . "px;max-width:" . $width . "px;max-height:" . $height . "px;' alt='cubierta album' src='" . $row['archivo'] . "' /></a>";
			$bottom = $bottom + 90;
			$left = $left + 90;
		}
	} else {
		echo "No estas etiquetado en ninguna foto";
	}
	echo "</div>";

	//Personalizados
	echo "<h2 style='clear: both;margin-bottom:0px;'>Albums personales</h2>";

	$personalizados = mysql_query("SELECT * FROM `albums` WHERE usuarios_idusuarios='" . $_GET['iduser'] . "'");
	if (mysql_num_rows($personalizados) > 0) {
		while ($row = mysql_fetch_assoc($personalizados)) {
			print("<div class='album'>
					<div class='album_titulo'>
						<a href='fotos.php?iduser=" . $_GET['iduser'] . "&idalbum=" . $row['idalbums'] . "'>". $row['album'] . "</a>
						<div class='album_renombrar' onclick=\"album_renombrar('".$row['idalbums']."','".$row['album']."')\"></div>
						<div class='album_borrar' onclick=\"album_borrar('".$row['idalbums']."','".$row['album']."')\"></div>
					</div>");
			$fotos = mysql_query("SELECT * FROM fotos WHERE albums_idalbums = '" . $row['idalbums'] . "' ORDER BY idfotos LIMIT 3");
			if (mysql_num_rows($fotos)) {
				$bottom = 0;
				$left = 0;
				while ($row = mysql_fetch_assoc($fotos)) {
					echo "<a href='fotos.php?iduser=" . $_GET['iduser'] . "&idalbum=" . $row['idalbums'] . "'><img class='album_cubierta' style='bottom:" . $bottom . "px;left:" . $left . "px;max-width:" . $width . "px;max-height:" . $height . "px;' alt='cubierta album' src='" . $row['archivo'] . "' /></a>";
					$bottom = $bottom + 90;
					$left = $left + 90;
				}
			} else {
				echo "No hay ninguna foto en este album";
			}
			echo "</div>";
		}
	}

	//Formulario creacion de albumes
	?>
	<div style='float:left;display: inline-block;margin-left: 35px;'>

		Crea un album personalizado
		<hr>
		Nombre del album:
		<input type="text" name="album" id='album_id'/>
		<button onclick="ajax_post('post.php','album='+$('#album_id').val(),'true')">
			Crear album
		</button>
	</div>
</div>

<script>
	$(document).ready(function() {
		// Muestra y oculta los menús
		$('.album').hover(function(e) {
			$(this).find('.album_renombrar,.album_borrar').css("visibility", "visible");
		}, function(e) {
			$(this).find('.album_renombrar,.album_borrar').css("visibility", "hidden");
		});
	});
	
	function album_renombrar(id,name){
		var name=prompt("Escribe el nombre del album",name);
		if (name!=null && name!=""){
			ajax_post('post.php', 'album_renombrar='+name+'&album_id='+id, 'true');
		}
	}
	
	function album_borrar(id,name){
		var r = confirm("¿Estás seguro de borrar el album \""+name+"\" ?");
		if (r==true && id!=""){
			ajax_post('post.php', 'album_borrar='+id, 'true');
		}
	}
</script>