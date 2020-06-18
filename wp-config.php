<?php
define( 'WP_CACHE', true ) ;

// BEGIN iThemes Security - Do not modify or remove this line
// iThemes Security Config Details: 2
define( 'DISALLOW_FILE_EDIT', true ); // Disable File Editor - Security > Settings > WordPress Tweaks > File Editor
// END iThemes Security - Do not modify or remove this line

/** Enable W3 Total Cache */
 // Added by W3 Total Cache

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u907403210_6Rkqi' );

/** MySQL database username */
define( 'DB_USER', 'u907403210_nR6lN' );

/** MySQL database password */
define( 'DB_PASSWORD', 'An4vyHACww' );

/** MySQL hostname */
define( 'DB_HOST', 'mysql' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'AzkRh[4)}=V4lK]3$[ES@U=snx,0k@h][3x9KDPvf!T08 Jd7njdA]pyhd{[MM]$' );
define( 'SECURE_AUTH_KEY',   '/Sv;Q&#?sb.XX+^*T`uK%w|l$7)E2qfJSlh]7Xn5&)I|%hcUjXSq-!<PbS45DqU*' );
define( 'LOGGED_IN_KEY',     '.N;FUk]lL6$9cQtK@MFzVNZg/iJX9Ox.A:nhV6gpAA>Y$dhL^+geoS]|HE(Z-Ska' );
define( 'NONCE_KEY',         'kX5cEdHifj{BZE b{4p4|_&bl[RK.XXo!=a@E]~L|fxz=SFs/P//rB|Lf2=rW7tE' );
define( 'AUTH_SALT',         '5kprW^&k,*{gGwf{!KzL>9j~(ZDzGI%Seo(HsCXJ.k<+)6T@AY(2:{lQ*}v{4tf}' );
define( 'SECURE_AUTH_SALT',  'L6yJ9>~g!0]N8yQ+fQJ}N3A.q+<sy%}oU69EhGY5`2XTe;wN<T8K58Kx}bCnry+R' );
define( 'LOGGED_IN_SALT',    '|BIOOpq1u(QTk_PeP{GSrN&xA}:2*&Mz=/E<sy)RKts#WZO&.UuoQhJ[9$y.+$):' );
define( 'NONCE_SALT',        '8p=D4CdT86E.Vm2g|Lb.f2b0Bo[7%egk fh8n40$Of,rXqlMaIMt0rf[qGhCK,Ob' );
define( 'WP_CACHE_KEY_SALT', 'C|.x|=B%qNsA<9;[|7cP>a7uqy?d#oOCiu9nFprT:uF<d=PeIx=47~s#u66_jzoT' );

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';




/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
