<p align="center">  
	<a href="https://aSocket.net">
		<img src="https://i.imgur.com/f0hofbX.png">
	</a>
</p>

# <div align="center">☃️ aSocket Snow - Web Effect</div>
<p align="center">  
	<img src="https://i.imgur.com/222MfH4.gif">
	<br>  
	<i>aSocket Snow enables individuals to easily add a seasonal effect to any web page.</i>
</p>

# Setup

 Simply download **`snow.js`** and include the following line in your HTML file: 
 ```html 
 <script src="snow.js"></script>
 ```

# Modularity
The snow effect can be easily customized via the configuration object.
```js
{
	'LIMIT': 20, // The maximum number of snowflakes to create.
	'BLUR': 1, // The filter blur value.
	'FALL_RATE': 5, // The rate at which snowflakes fall.
	'SWAY_RATE': 1, // The rate at which snowflakes sway.
},
```
*An unlimited amount of layers can be added to the configuration.*

# Control
The snow effect can be controlled by executing the command **`aSocketSnow.command(cmd)`**.<br>
*(This can be utilized via a user preferences menu, toggle button, etc.)*

The following can be passed as arguments to the command, enacting the corresponding effects:

**`clear`** - Clears all snowflakes from the DOM and controller.

**`spawn`** - Spawns a new snowflake.

**`start`** - Used to start the snowflake controller animation/creation flow if stopped.

**`stop`** - Stops the snowflake controller animation/creation flow.
