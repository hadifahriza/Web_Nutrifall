/**
 * @output wp-includes/js/wp-api.js
 */

(function( window, undefined ) {

	'use strict';

	/**
	 * Initialise the WP_API.
	 */
	function WP_API() {
		/** @namespace wp.api.models */
		this.models = {};
		/** @namespace wp.api.collections */
		this.collections = {};
		/** @namespace wp.api.views */
		this.views = {};
	}

	/** @namespace wp */
	window.wp            = window.wp || {};
	/** @namespace wp.api */
	wp.api               = wp.api || new WP_API();
	wp.api.versionString = wp.api.versionString || 'wp/v2/';

	// Alias _includes to _.contains, ensuring it is available if lodash is used.
	if ( ! _.isFunction( _.includes ) && _.isFunction( _.contains ) ) {
	  _.includes = _.contains;
	}

})( window );

(function( window, undefined ) {

	'use strict';

	var pad, r;

	/** @namespace wp */
	window.wp = window.wp || {};
	/** @namespace wp.api */
	wp.api = wp.api || {};
	/** @namespace wp.api.utils */
	wp.api.utils = wp.api.utils || {};

	/**
	 * Determine model based on API route.
	 *
	 * @param {string} route    The API route.
	 *
	 * @return {Backbone Model} The model found at given route. Undefined if not found.
	 */
	wp.api.getModelByRoute = function( route ) {
		return _.find( wp.api.models, function( model ) {
			return model.prototype.route && route === model.prototype.route.index;
		} );
	};

	/**
	 * Determine collection based on API route.
	 *
	 * @param {string} route    The API route.
	 *
	 * @return {Backbone Model} The collection found at given route. Undefined if not found.
	 */
	wp.api.getCollectionByRoute = function( route ) {
		return _.find( wp.api.collections, function( collection ) {
			return collection.prototype.route && route === collection.prototype.route.index;
		} );
	};


	/**
	 * ECMAScript 5 shim, adapted from MDN.
	 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
	 */
	if ( ! Date.prototype.toISOString ) {
		pad = function( number ) {
			r = String( number );
			if ( 1 === r.length ) {
				r = '0' + r;
			}

			return r;
		};

		Date.prototype.toISOString = function() {
			return this.getUTCFullYear() +
				'-' + pad( this.getUTCMonth() + 1 ) +
				'-' + pad( this.getUTCDate() ) +
				'T' + pad( this.getUTCHours() ) +
				':' + pad( this.getUTCMinutes() ) +
				':' + pad( this.getUTCSeconds() ) +
				'.' + String( ( this.getUTCMilliseconds() / 1000 ).toFixed( 3 ) ).slice( 2, 5 ) +
				'Z';
		};
	}

	/**
	 * Parse date into ISO8601 format.
	 *
	 * @param {Date} date.
	 */
	wp.api.utils.parseISO8601 = function( date ) {
		var timestamp, struct, i, k,
			minutesOffset = 0,
			numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];

		/*
		 * ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
		 * before falling back to any implementation-specific date parsing, so that’s what we do, even if native
		 * implementations could be faster.
		 */
		//              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
		if ( ( struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec( date ) ) ) {

			// Avoid NaN timestamps caused by “undefined” values being passed to Date.UTC.
			for ( i = 0; ( k = numericKeys[i] ); ++i ) {
				struct[k] = +struct[k] || 0;
			}

			// Allow undefined days and months.
			struct[2] = ( +struct[2] || 1 ) - 1;
			struct[3] = +struct[3] || 1;

			if ( 'Z' !== struct[8]  && undefined !== struct[9] ) {
				minutesOffset = struct[10] * 60 + struct[11];

				if ( '+' === struct[9] ) {
					minutesOffset = 0 - minutesOffset;
				}
			}

			timestamp = Date.UTC( struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7] );
		} else {
			timestamp = Date.parse ? Date.parse( date ) : NaN;
		}

		return timestamp;
	};

	/**
	 * Helper function for getting the root URL.
	 * @return {[type]} [description]
	 */
	wp.api.utils.getRootUrl = function() {
		return window.location.origin ?
			window.location.origin + '/' :
			window.location.protocol + '//' + window.location.host + '/';
	};

	/**
	 * Helper for capitalizing strings.
	 */
	wp.api.utils.capitalize = function( str ) {
		if ( _.isUndefined( str ) ) {
			return str;
		}
		return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	};

	/**
	 * Helper function that capitalizes the first word and camel cases any words starting
	 * after dashes, removing the dashes.
	 */
	wp.api.utils.capitalizeAndCamelCaseDashes = function( str ) {
		if ( _.isUndefined( str ) ) {
			return str;
		}
		str = wp.api.utils.capitalize( str );

		return wp.api.utils.camelCaseDashes( str );
	};

	/**
	 * Helper function to camel case the letter after dashes, removing the dashes.
	 */
	wp.api.utils.camelCaseDashes = function( str ) {
		return str.replace( /-([a-z])/g, function( g ) {
			return g[ 1 ].toUpperCase();
		} );
	};

	/**
	 * Extract a route part based on negative index.
	 *
	 * @param {string}   route          The endpoint route.
	 * @param {int}      part           The number of parts from the end of the route to retrieve. Default 1.
	 *                                  Example route `/a/b/c`: part 1 is `c`, part 2 is `b`, part 3 is `a`.
	 * @param {string}  [versionString] Version string, defaults to `wp.api.versionString`.
	 * @param {boolean} [reverse]       Whether to reverse the order when extracting the route part. Optional, default false.
	 */
	wp.api.utils.extractRoutePart = function( route, part, versionString, reverse ) {
		var routeParts;

		part = part || 1;
		versionString = versionString || wp.api.versionString;

		// Remove versions string from route to avoid returning it.
		if ( 0 === route.indexOf( '/' + versionString ) ) {
			route = route.substr( versionString.length + 1 );
		}

		routeParts = route.split( '/' );
		if ( reverse ) {
			routeParts = routeParts.reverse();
		}
		if ( _.isUndefined( routeParts[ --part ] ) ) {
			return '';
		}
		return routeParts[ part ];
	};

	/**
	 * Extract a parent name from a passed route.
	 *
	 * @param {string} route The route to extract a name from.
	 */
	wp.api.utils.extractParentName = function( route ) {
		var name,
			lastSlash = route.lastIndexOf( '_id>[\\d]+)/' );

		if ( lastSlash < 0 ) {
			return '';
		}
		name = route.substr( 0, lastSlash - 1 );
		name = name.split( '/' );
		name.pop();
		name = name.pop();
		return name;
	};

	/**
	 * Add args and options to a model prototype from a route's endpoints.
	 *
	 * @param {array}  routeEndpoints Array of route endpoints.
	 * @param {Object} modelInstance  An instance of the model (or collection)
	 *                                to add the args to.
	 */
	wp.api.utils.decorateFromRoute = function( routeEndpoints, modelInstance ) {

		/**
		 * Build the args based on route endpoint data.
		 */
		_.each( routeEndpoints, function( routeEndpoint ) {

			// Add post and edit endpoints as model args.
			if ( _.includes( routeEndpoint.methods, 'POST' ) || _.includes( routeEndpoint.methods, 'PUT' ) ) {

				// Add any non empty args, merging them into the args object.
				if ( ! _.isEmpty( routeEndpoint.args ) ) {

					// Set as default if no args yet.
					if ( _.isEmpty( modelInstance.prototype.args ) ) {
						modelInstance.prototype.args = routeEndpoint.args;
					} else {

						// We already have args, merge these new args in.
						modelInstance.prototype.args = _.extend( modelInstance.prototype.args, routeEndpoint.args );
					}
				}
			} else {

				// Add GET method as model options.
				if ( _.includes( routeEndpoint.methods, 'GET' ) ) {

					// Add any non empty args, merging them into the defaults object.
					if ( ! _.isEmpty( routeEndpoint.args ) ) {

						// Set as default if no defaults yet.
						if ( _.isEmpty( modelInstance.prototype.options ) ) {
							modelInstance.prototype.options = routeEndpoint.args;
						} else {

							// We already have options, merge these new args in.
							modelInstance.prototype.options = _.extend( modelInstance.prototype.options, routeEndpoint.args );
						}
					}

				}
			}

		} );

	};

	/**
	 * Add mixins and helpers to models depending on their defaults.
	 *
	 * @param {Backbone Model} model          The model to attach helpers and mixins to.
	 * @param {string}         modelClassName The classname of the constructed model.
	 * @param {Object} 	       loadingObjects An object containing the models and collections we are building.
	 */
	wp.api.utils.addMixinsAndHelpers = function( model, modelClassName, loadingObjects ) {

		var hasDate = false,

			/**
			 * Array of parseable dates.
			 *
			 * @type {string[]}.
			 */
			parseableDates = [ 'date', 'modified', 'date_gmt', 'modified_gmt' ],

			/**
			 * Mixin for all content that is time stamped.
			 *
			 * This mixin converts between mysql timestamps and JavaScript Dates when syncing a model
			 * to or from the server. For example, a date stored as `2015-12-27T21:22:24` on the server
			 * gets expanded to `Sun Dec 27 2015 14:22:24 GMT-0700 (MST)` when the model is fetched.
			 *
			 * @type {{toJSON: toJSON, parse: parse}}.
			 */
			TimeStampedMixin = {

				/**
				 * Prepare a JavaScript Date for transmitting to the server.
				 *
				 * This helper function accepts a field and Date object. It converts the passed Date
				 * to an ISO string and sets that on the model field.
				 *
				 * @param {Date}   date   A JavaScript date object. WordPress expects dates in UTC.
				 * @param {string} field  The date field to set. One of 'date', 'date_gmt', 'date_modified'
				 *                        or 'date_modified_gmt'. Optional, defaults to 'date'.
				 */
				setDate: function( date, field ) {
					var theField = field || 'date';

					// Don't alter non parsable date fields.
					if ( _.indexOf( parseableDates, theField ) < 0 ) {
						return false;
					}

					this.set( theField, date.toISOString() );
				},

				/**
				 * Get a JavaScript Date from the passed field.
				 *
				 * WordPress returns 'date' and 'date_modified' in the timezone of the server as well as
				 * UTC dates as 'date_gmt' and 'date_modified_gmt'. Draft posts do not include UTC dates.
				 *
				 * @param {string} field  The date field to set. One of 'date', 'date_gmt', 'date_modified'
				 *                        or 'date_modified_gmt'. Optional, defaults to 'date'.
				 */
				getDate: function( field ) {
					var theField   = field || 'date',
						theISODate = this.get( theField );

					// Only get date fields and non null values.
					if ( _.indexOf( parseableDates, theField ) < 0 || _.isNull( theISODate ) ) {
						return false;
					}

					return new Date( wp.api.utils.parseISO8601( theISODate ) );
				}
			},

			/**
			 * Build a helper function to retrieve related model.
			 *
			 * @param  {string} parentModel      The parent model.
			 * @param  {int}    modelId          The model ID if the object to request
			 * @param  {string} modelName        The model name to use when constructing the model.
			 * @param  {string} embedSourcePoint Where to check the embedds object for _embed data.
			 * @param  {string} embedCheckField  Which model field to check to see if the model has data.
			 *
			 * @return {Deferred.promise}        A promise which resolves to the constructed model.
			 */
			buildModelGetter = function( parentModel, modelId, modelName, embedSourcePoint, embedCheckField ) {
				var getModel, embeddeds, attributes, deferred;

				deferred  = jQuery.Deferred();
				embeddeds = parentModel.get( '_embedded' ) || {};

				// Verify that we have a valid object id.
				if ( ! _.isNumber( modelId ) || 0 === modelId ) {
					deferred.reject();
					return deferred;
				}

				// If we have embedded object data, use that when constructing the getModel.
				if ( embeddeds[ embedSourcePoint ] ) {
					attributes = _.findWhere( embeddeds[ embedSourcePoint ], { id: modelId } );
				}

				// Otherwise use the modelId.
				if ( ! attributes ) {
					attributes = { id: modelId };
				}

				// Create the new getModel model.
				getModel = new wp.api.models[ modelName ]( attributes );

				if ( ! getModel.get( embedCheckField ) ) {
					getModel.fetch( {
						success: function( getModel ) {
							deferred.resolve( getModel );
						},
						error: function( getModel, response ) {
							deferred.reject( response );
						}
					} );
				} else {
					// Resolve with the embedded model.
					deferred.resolve( getModel );
				}

				// Return a promise.
				return deferred.promise();
			},

			/**
			 * Build a helper to retrieve a collection.
			 *
			 * @param  {string} parentModel      The parent model.
			 * @param  {string} collectionName   The name to use when constructing the collection.
			 * @param  {string} embedSourcePoint Where to check the embedds object for _embed data.
			 * @param  {string} embedIndex       An addiitonal optional index for the _embed data.
			 *
			 * @return {Deferred.promise}        A promise which resolves to the constructed collection.
			 */
			buildCollectionGetter = function( parentModel, collectionName, embedSourcePoint, embedIndex ) {
				/**
				 * Returns a promise that resolves to the requested collection
				 *
				 * Uses the embedded data if available, otherwises fetches the
				 * data from the server.
				 *
				 * @return {Deferred.promise} promise Resolves to a wp.api.collections[ collectionName ]
				 * collection.
				 */
				var postId, embeddeds, getObjects,
					classProperties = '',
					properties      = '',
					deferred        = jQuery.Deferred();

				postId    = parentModel.get( 'id' );
				embeddeds = parentModel.get( '_embedded' ) || {};

				// Verify that we have a valid post id.
				if ( ! _.isNumber( postId ) || 0 === postId ) {
					deferred.reject();
					return deferred;
				}

				// If we have embedded getObjects data, use that when constructing the getObjects.
				if ( ! _.isUndefined( embedSourcePoint ) && ! _.isUndefined( embeddeds[ embedSourcePoint ] ) ) {

					// Some embeds also include an index offset, check for that.
					if ( _.isUndefined( embedIndex ) ) {

						// Use the embed source point directly.
						properties = embeddeds[ embedSourcePoint ];
					} else {

						// Add the index to the embed source point.
						properties = embeddeds[ embedSourcePoint ][ embedIndex ];
					}
				} else {

					// Otherwise use the postId.
					classProperties = { parent: postId };
				}

				// Create the new getObjects collection.
				getObjects = new wp.api.collections[ collectionName ]( properties, classProperties );

				// If we didn’t have embedded getObjects, fetch the getObjects data.
				if ( _.isUndefined( getObjects.models[0] ) ) {
					getObjects.fetch( {
						success: function( getObjects ) {

							// Add a helper 'parent_post' attribute onto the model.
							setHelperParentPost( getObjects, postId );
							deferred.resolve( getObjects );
						},
						error: function( getModel, response ) {
							deferred.reject( response );
						}
					} );
				} else {

					// Add a helper 'parent_post' attribute onto the model.
					setHelperParentPost( getObjects, postId );
					deferred.resolve( getObjects );
				}

				// Return a promise.
				return deferred.promise();

			},

			/**
			 * Set the model post parent.
			 */
			setHelperParentPost = function( collection, postId ) {

				// Attach post_parent id to the collection.
				_.each( collection.models, function( model ) {
					model.set( 'parent_post', postId );
				} );
			},

			/**
			 * Add a helper function to handle post Meta.
			 */
			MetaMixin = {

				/**
				 * Get meta by key for a post.
				 *
				 * @param {string} key The meta key.
				 *
				 * @return {object} The post meta value.
				 */
				getMeta: function( key ) {
					var metas = this.get( 'meta' );
					return metas[ key ];
				},

				/**
				 * Get all meta key/values for a post.
				 *
				 * @return {object} The post metas, as a key value pair object.
				 */
				getMetas: function() {
					return this.get( 'meta' );
				},

				/**
				 * Set a group of meta key/values for a post.
				 *
				 * @param {object} meta The post meta to set, as key/value pairs.
				 */
				setMetas: function( meta ) {
					var metas = this.get( 'meta' );
					_.extend( metas, meta );
					this