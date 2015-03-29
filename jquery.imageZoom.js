/* global $, jQuery, localStorage, window, angular, alert, document, console, confirm, require */
/* jshint unused:false */
/* jshint plusplus: false, devel: true, nomen: true, indent: 4, maxerr: 50 */
/* jshint laxbreak: true */
/* global define */

/*! Sten Hougaard, March 2015, @Netsi1964 */
'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}

}(function ($) {
	$.fn.imageZoom = function (options) {

		$.fn.imageZoom.update = function (target, data) {
			target.css({
				"background-size": data.zoom * 100 + "%"
			});
			data.pX = -data.offsetX * (data.zoom - 1);
			data.pY = -data.offsetY * (data.zoom - 1);
			target.css({
				"background-position": data.pX + "px " + data.pY + "px"
			});
		};

		return this.each(function () {

			options = options || {};


			// settings
			var me = {},
				defaults = {
					"zoom": 1,
					"zoomSpeed": 0.025,
					"min": 1,
					"max": 10,
					"clickZoomSpeed": 2,
					"change": null,
					"target": null
				};


			me.ele = $(this);
			me.id = (new Date() - new Date(1964, 8, 24, 23, 35));
			me.settings = $.extend({}, defaults, options);

			// initialise element
			me.zoomElement = me.ele.find(".zoom:first");
			if (me.zoomElement.length === 0) {
				me.slider = $("<input type=\"range\" value=\"" + me.settings.zoom + "\" min=\"" + me.settings.min + "\" max=\"" + me.settings.max + "\" step=\"" + me.settings.zoomSpeed + "\" class=\"zoom\" / >");
				me.ele.prepend(me.slider);
				me.zoomElement = $("input", me.ele);
			};
			me.settings.target = (me.settings.target !== null) ? $(me.settings.target) : me.ele;

			// methods
			me.imageInteraction = function (e) {
				me.offsetX = e.offsetX;
				me.offsetY = e.offsetY;
				if (typeof e.originalEvent.deltaY !== "undefined") {
					me.zoom -= Math.round(-e.originalEvent.deltaY * me.settings.zoomSpeed * 100) / 100;
					me.setZoom();
				} else {
					me.update();
				}
				e.preventDefault();
				return false;
			};

			me.setZoom = function (zoom) {
				if (typeof zoom !== "object") {
					zoom = (arguments.length === 1) ? zoom : me.zoom;
				} else {
					// We are called from a change on the zoom range
					zoom = me.zoomElement.val();
				};
				me.zoom = (zoom <= me.settings.min) ? me.settings.min : (zoom >= me.settings.max) ? me.settings.max : zoom;
				me.update();
			};

			me.clickZoom = function (e) {
				var direction = me.settings.clickZoomSpeed;
				if (typeof e !== "undefined") {
					if (typeof e.shiftKey !== "undefined") {
						direction = (e.shiftKey) ? -me.settings.clickZoomSpeed : me.settings.clickZoomSpeed;
						e.preventDefault();
					} else {
						direction = (!!e) ? me.settings.clickZoomSpeed : -me.settings.clickZoomSpeed;
					}
				}
				me.zoom += direction;
				me.update();
			}

			me.update = function () {
				$.fn.imageZoom.update(me.settings.target, me);
				me.zoomElement.val(me.zoom);
				if (typeof me.settings.change === "function") {
					me.settings.change.call(me, me);
				}

			};


			me.ele.on("mousemove mousewheel", me.imageInteraction);
			me.ele.on("dblclick", me.clickZoom);
			me.zoomElement.on("click", me.setZoom);

			// set default values
			me.ele.css("background-size", me.zoom * 100 + "%");
			me.zoom = me.settings.zoom;
			me.update();
		});

	};
}));