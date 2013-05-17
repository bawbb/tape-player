/**
 * 
 * @author Bobby Vicidomini
 * 
 * TODO: kill library depencies (jquery,tweenlite,sound.js)
 * 
 */

var TapePlayer = function( container )
{
	var _this = this;
	 
	this.$container = $( container );
	this.$container.wrapInner( '<div class="tape-content"></div>' );
	this.$container.append( '<div class="tape-case"><div class="tape-wheels"><div class="tape-wheel wheel-left"></div><div class="tape-wheel wheel-right"></div><span class="tape-buffering">buffering ;)</span></div></div>' );
	this.$buffering = this.$container.find(".tape-buffering");
	this.$buffering.css( "visibility", "hidden" );
	this.$content = this.$container.children( ".tape-content" );
	this.openPosition = getStyleFromCssClass( ".tape .tape-content.open", "left" );
	
	this.$container.hover( function( evt ) {
		TweenLite.to(_this.$content, 0.5, { className: "+=open", ease: Expo.easeInOut });
		//TweenLite.to(_this.$content, 0.5, { left: _this.openPosition, ease: Expo.easeInOut });
	}, function( evt) {
		TweenLite.to(_this.$content, 0.5, { className: "-=open", ease: Expo.easeInOut });
		//TweenLite.to(_this.$content, 0.5, { left: "0px", ease: Expo.easeInOut });
	});
	
	this.$tapeWheels = this.$container.find( ".tape-wheel" );
	this.wheelTween = TweenLite.to(this.$tapeWheels, 1, {rotation: 359, ease: Linear.easeNone, onComplete: function() {
		_this.wheelTween.restart();
	}});
	this.wheelTween.pause();
	
	this.$content.find( "li" ).each( function( i ) {
		
		var $track = $( this ).children( "a[href]" );
		
		if ($track.length > 0) {
			
			var trackUrl = $track.attr( "href" );
			TapePlayer.tracks.push( trackUrl );
			
			$track.bind( "click", function( evt ) {
				
				if (TapePlayer.wheelTween != undefined) {
					TapePlayer.wheelTween.pause();
				}
				
				TapePlayer.wheelTween = _this.wheelTween;
				TapePlayer.$bufferSpan = _this.$buffering;
				
				TapePlayer.tapeStart();
				
				if ( TapePlayer.currentTrack != undefined ) {
					TapePlayer.currentTrack.stop();
					TapePlayer.currentTrack.src = trackUrl;
				} else {
					TapePlayer.currentTrack = createjs.Sound.createInstance( trackUrl );
					TapePlayer.currentTrack.addEventListener( "complete", function( evt ) {
						TapePlayer.wheelTween.pause();
						TapePlayer.tapeStopSound.play( createjs.Sound.INTERRUPT_ANY );
					});
					TapePlayer.currentTrack.addEventListener( "failed", function( err ) { console.log(err); });
				}
				
				return false;
			});
			
			$track.removeAttr( "href" );
		}
	});
	
}

TapePlayer.tapeStart = function()
{
	TapePlayer.tapeStartSound.play( createjs.Sound.INTERRUPT_ANY );
}

TapePlayer.tapeSeek = function()
{
	TapePlayer.$bufferSpan.css( "visibility", "visible" );
	
	TapePlayer.wheelTween.timeScale( 3 );
	TapePlayer.wheelTween.resume();
	
	TapePlayer.tapeStartSound.stop();
	TapePlayer.tapeSeekSound.play( createjs.Sound.INTERRUPT_ANY, 0, 0, -1 );
	
	createjs.Sound.registerSound( TapePlayer.currentTrack.src );
}

TapePlayer.trackLoaded = function( )
{
	TapePlayer.$bufferSpan.css( "visibility", "hidden" );
	
	TapePlayer.tapeSeekSound.stop();
	TapePlayer.tapeStopSound.addEventListener( "complete", TapePlayer.tapeStopAndPlay );
	TapePlayer.tapeStopSound.play( createjs.Sound.INTERRUPT_ANY );
	TapePlayer.wheelTween.pause();
}

TapePlayer.tapeStopAndPlay = function()
{
	TapePlayer.tapeStopSound.stop();
	TapePlayer.tapeStopSound.removeEventListener( "complete", TapePlayer.tapeStopAndPlay );
	TapePlayer.currentTrack.play( createjs.Sound.INTERRUPT_ANY );
	
	TapePlayer.wheelTween.timeScale(1);
	TapePlayer.wheelTween.resume();
}

TapePlayer.tracks = [];
TapePlayer.currentTrack = undefined;
TapePlayer.$wheels = undefined;
TapePlayer.$bufferSpan = undefined;
TapePlayer.path = getFolderPathOfLastScript();

//TapePlayer.loadQueue = new createjs.LoadQueue();
//TapePlayer.loadQueue.installPlugin( createjs.Sound );
//TapePlayer.loadQueue.addEventListener( "complete", TapePlayer.trackLoaded );

if ( navigator.userAgent.match( /iPhone|iPad|iPod/i )) {
	createjs.Sound.registerPlugin( createjs.WebAudioPlugin );
} else {
	createjs.Sound.registerPlugin( createjs.HTMLAudioPlugin );
}

TapePlayer.tapeStartSound = createjs.Sound.createInstance(TapePlayer.path + "tape-start.mp3");
TapePlayer.tapeStartSound.addEventListener( "complete", TapePlayer.tapeSeek );
TapePlayer.tapeSeekSound = createjs.Sound.createInstance(TapePlayer.path + "tape-seek.mp3");
TapePlayer.tapeStopSound = createjs.Sound.createInstance(TapePlayer.path + "tape-stop.mp3");


createjs.Sound.addEventListener( "loadComplete", function(evt) { setTimeout(TapePlayer.trackLoaded, 500); } );

/*
 * GLOBAL HELPER FUNCTIONS...
 */

function getFolderPathOfLastScript( scripts )
{
	var scripts = document.getElementsByTagName( "script" ),
		src = scripts[scripts.length-1].src,
		path = src.substr( 0, src.lastIndexOf( "/" ) + 1 );
	return path;
}

function getStyleFromCssClass( className, property ) {
	
    var classes = document.styleSheets[ 0 ].rules || document.styleSheets[ 0 ].cssRules
    var classStyle = "";
    for( var x = 0; x < classes.length; x++ ) {
        if( classes[ x ].selectorText == className ) {
                //( classes[ x ].cssText ) ? alert( classes[ x ].cssText ) : alert( classes[ x ].style.cssText );
                ( classes[ x ].cssText ) ? classStyle = classes[ x ].cssText : classStyle = classes[ x ].style.cssText ;
        }
    }
    
    if ( classStyle.indexOf( className ) === -1 || classStyle.indexOf( property ) === -1) {
    	return "";
    }
    
    classStyle = classStyle.replace(/\s+/g, "");
    classStyle = classStyle.substr( classStyle.indexOf( property ) + property.length+1 )
    classStyle = classStyle.substr( 0, classStyle.indexOf(";"));
    
    return classStyle;
}
