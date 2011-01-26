/*
 * jQuery dragable and dropable.
 * @version: 0.1
 * @requires jQuery v1.3 or later 
 *
 */

/*
 * jQuery dragable.
 * @param options (optional) 
 *    - dragClass (optional): the style of drag element
 *
 */
(function($){
    // plugin definition
    $.fn.dragable = function(options){
        var opts = $.extend({}, $.fn.dragable.defaults, options);
        var dragClass = opts.dragClass;
        $(this).each(function(){
        	var name = new Date().getTime();
        	var $drag = $(this);
        	$drag.mousedown(function(e){
        		if(opts.helper && $.isFunction(opts.helper)){
        			opts.helper.call(this);
        		}
    			var $dragClone = $drag.clone();
    			$("body").append("<div id='dragable-"+name+"'></div>");
    			var $dragElement = $("#dragable-"+name);
    			$dragElement.append($dragClone);
    			$dragElement.attr("data-dragable",name);
    			$dragElement.data("data-dragable",$dragClone);
    			$dragElement.hide();
    			$dragElement.addClass(dragClass);
    			var offsetX = e.pageX - $drag.offset().left;
    			var offsetY = e.pageY - $drag.offset().top;
    			e.preventDefault();
    			$("body").bind("mousemove."+name,function(moveEvent){
    				$dragElement.show();
    				$dragElement.css("left",(moveEvent.pageX+10)+"px");
    				$dragElement.css("top",(moveEvent.pageY+10)+"px");
    			});
    			$("body").bind("mouseup."+name,function(upEvent){
    				$dragElement.remove();
    				$("body").unbind("mousemove."+name);
    				$("body").unbind("mouseup."+name);
    			});
    		});
        });
        
    }
    // plugin defaults
    $.fn.dragable.defaults = {dragClass:"drag"};
})(jQuery);


/*
 * jQuery dropable.
 * @param options (optional)
 *    - accept (required): the element when drag.
 *    - drop (required): the handled when mouse up.
 *    - dropClass (optional): the style of drop element
 */
(function($){
    // plugin definition
    $.fn.dropable = function(options){
        var opts = $.extend({}, $.fn.dropable.defaults, options);
        $(this).each(function(){
        	 var $drop = $(this);
             var acceptElement = opts.accept;
             var dropClass = opts.dropClass;
             $drop.mouseover(function(e){
     			if($("body").find("*[data-dragable]").find(acceptElement).size()>0){
     				$drop.addClass(dropClass);
     			}
     		});
             
             $drop.mouseout(function(e){
     			if($drop.hasClass(dropClass)){
     				$drop.removeClass(dropClass);
     			}
     		});
             
             $drop.mouseup(function(e){
             	if($("body").find("*[data-dragable]").find(acceptElement).size()>0){
             		var dragable = $("body").find("*[data-dragable]").data("data-dragable");
             		if(opts.drop && $.isFunction(opts.drop)){
             			opts.drop.call($drop,e,{dragable:dragable});
             		}
             	}
     		});
             
        });
       
    }

    // plugin defaults 
	$.fn.dropable.defaults = {dropClass:"drop"};
})(jQuery);
