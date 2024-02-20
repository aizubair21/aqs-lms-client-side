function Slider() {
    this.init = function(container, slide, thumbnail, delay, autoplay, arrows, draggable) {
        jQuery(thumbnail + '.1').addClass('active');
        var fullWidth = (jQuery(container).width());
        var fullHeight = (jQuery(container).height());
        jQuery(container).css('width', fullWidth);
        jQuery(slide).css('width', fullWidth);
        var imageWidth = jQuery(slide).width();
        var imageCount = jQuery(slide).length;
        var containerWidth = imageWidth * imageCount;
        var slidePosition = 1;
        var timer;
        var clicking = false;
        var dragMovement;
        var startX;

        jQuery(window).resize(function(){
            fullWidth = jQuery(container).parent().width();
            jQuery(container).css('width', fullWidth);
            jQuery(slide).css('width', fullWidth);
            imageWidth = jQuery(slide).width();
            containerWidth = imageWidth * imageCount;
            jQuery(slide).css({
                'width': imageWidth,  
                'float': 'left'
            });
            jQuery(container).css('width', containerWidth);
        });

        if (imageCount == 1) {
            jQuery(arrows + ' #left.slide-control').css('display', 'none');
            jQuery(arrows + ' #right.slide-control').css('display', 'none');
        }

        jQuery(slide).css({
            'width': imageWidth,
            'float': 'left'
        });

        jQuery(container).css('width', containerWidth);
        jQuery(arrows + ' #left.slide-control').css('display', 'none');

        jQuery(arrows + ' #left.slide-control').click(function() {
            slidePosition--;
            slideChange(slidePosition, imageCount);
            resetTimer();
        });

        jQuery(arrows + ' #right.slide-control').click(function() {
            slidePosition++;
            slideChange(slidePosition, imageCount);
            resetTimer();
        });

        jQuery(thumbnail).click(function() {
            slidePosition = jQuery(this).attr('class').replace(/\D/g, '');
            slideChange(slidePosition, imageCount);
            resetTimer();
        });

        /* Start of touch dragging */
        if(draggable == true){
            jQuery(slide).on('mousedown touchstart', function(e){
                clicking = true;
                disableTimer();
                dragMovement = 0;
                if(event.touches == null){
                    startX = (e.clientX - (jQuery(container).parent().offset().left));
                } else {
                    startX = (event.touches[0].pageX - (jQuery(container).parent().offset().left));
                }
                jQuery(container).css('transition', 'none');
            });

            jQuery(slide).on('mouseup touchend', function(){
                jQuery(container).css('transition', 'all 300ms');
                clicking = false;
                resetTimer();
                if(dragMovement != null){
                    if(dragMovement <= 30 && dragMovement >= -30){
                        //do nothing because its just a click.
						slideChange(slidePosition, imageCount);
                    } else if(dragMovement > 30){
                        slidePosition--;
                        slideChange(slidePosition, imageCount);
                    } else if(dragMovement < -30){
                        slidePosition++;
                        slideChange(slidePosition, imageCount);
                    }
                }
                dragMovement = null;
            });

            jQuery(slide).on('mousemove touchmove', function(e){
                if(clicking == false) return;
                if(event.touches == null){
                    dragMovement = ((e.pageX - (jQuery(container).parent().offset().left)) - startX);
                } else { 
                    dragMovement = ((event.touches[0].pageX - (jQuery(container).parent().offset().left)) - startX);
                }
                jQuery(container).css('margin-left',  "calc(-" + (slidePosition - 1) * 100 + "% + "+dragMovement+"px)");
            });
        }

        function autoPlay() {
            slidePosition++;
            slideChange(slidePosition, imageCount);
        }
        if (autoplay == true) {
            var timer = setInterval(function() {
                if(!jQuery(container).hasClass("stop-autoplay")){
					autoPlay();
				}
            }, delay);
        }

        function resetTimer(){
            clearInterval(timer);
            if (autoplay == true) {
                timer = setInterval(function() {
                    if(!jQuery(container).hasClass("stop-autoplay")){
			    		autoPlay();
		    		}
                }, delay);
            }
        }

        function disableTimer(){
            clearInterval(timer);
        }

        function slideChange(pos, imageCount) {
            if(pos <= 0){
                pos = 1;
                slidePosition = 1;
            } else if(pos > imageCount){
                pos = 1;
                slidePosition = 1;
            }
            
            if (slidePosition == imageCount) {
                jQuery(arrows + ' #right.slide-control').css('display', 'none');
                jQuery(arrows + ' #left.slide-control').css('display', 'block');
            } else {
                jQuery(arrows + ' #right.slide-control').css('display', 'block');
                jQuery(arrows + ' #left.slide-control').css('display', 'block');
            }
        
            jQuery(thumbnail + ', ' + slide).removeClass('active');
            jQuery(thumbnail + '.' + pos).addClass('active');
            jQuery(slide + '.' + pos).addClass('active');
            jQuery(container).css('margin-left', "-" + (pos - 1) * 100 + "%");
        }
    }
}


