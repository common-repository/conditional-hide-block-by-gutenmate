<?php
/**
 * Plugin Name:       Conditional Hide Block by Gutenmate
 * Description:       Lightweight block visibility options.
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Version:           1.0.0
 * Author:            Gutenmate
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gtm
 * Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'init', 'gtm_visibility_init' );
function gtm_visibility_init() {
	// Load text domain
	load_plugin_textdomain( 'gtm', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

	// Register scripts & styles
	$asset = require dirname( __FILE__ ) . '/build/index.asset.php';

	wp_register_script(
		'gtm-visibility-editor-script',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset['dependencies'],
		$asset['version']
	);

	wp_register_style( 'gtm-visibility-editor-style', plugins_url( 'build/index.css', __FILE__ ), false, $asset['version'], 'all' );
	wp_register_style( 'gtm-visibility-style', plugins_url( 'build/style-index.css', __FILE__ ), false, $asset['version'], 'all' );
}

add_action( 'enqueue_block_editor_assets', 'gtm_visibility_enqueue_block_editor_assets' );
function gtm_visibility_enqueue_block_editor_assets() {
	wp_enqueue_script( 'gtm-visibility-editor-script' );
	wp_enqueue_style( 'gtm-visibility-editor-style' );
}

add_action( 'enqueue_block_assets', 'gtm_visibility_enqueue_block_assets' );
function gtm_visibility_enqueue_block_assets() {
	if ( is_admin() ) {
		// Alternate styling in editor for better UX
		wp_enqueue_style( 'gtm-visibility-editor-style' );
	} else {
		wp_enqueue_style( 'gtm-visibility-style' );
	}
}

add_filter( 'render_block_core/query', 'gtm_visibility_render_block_core_query', 10, 3 );
function gtm_visibility_render_block_core_query( $block_content, $block, $instance ) {
	if ( $block_content && ! empty( $block['attrs']['gtmHideWhenNoResult'] ) ) {
		$html = new WP_HTML_Tag_Processor( $block_content );
		if ( ! $html->next_tag( ['class_name' => 'wp-block-post-template'] ) ) {
			// Hide entire block
			return '';
		}
	}

	return $block_content;
}
