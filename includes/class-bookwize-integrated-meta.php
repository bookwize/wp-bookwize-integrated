<?php

/**
 * The Class.
 */
class Bookwize_Integrated_Meta {

	public $settings = [
		'post_types' => [
			'post',
			'page'
		],
		'page_types' => [
			BW_PAGE_TYPE_INTEGRATED => 'Bookwize Integrated Engine',
		]
	];

	public function __construct( array $options = [ 'post_types' => [ ] ] ) {

		if ( ! empty( $options['post_types'] ) ) {
			foreach ( $options as $option ) {
				if ( ! in_array( $option, $this->settings['post_types'] ) ) {
					$this->settings['post_types'][] = $option;
				}
			}
		}

		add_action( 'init', array( &$this, 'init' ) );
	}

	public function init() {

		$post_types = apply_filters( 'hp/meta_post_types', $this->settings['post_types'] );
		if ( is_array( $post_types ) ) {
			$this->settings['post_types'] = $post_types;
		}
	}

	/**
	 * Hook into the appropriate actions when the class is constructed.
	 */
	public function load_post() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'save_post', array( $this, 'save' ) );
	}

	/**
	 * Adds the meta box container.
	 */
	public function add_meta_box( $post_type ) {

		if ( ! in_array( $post_type, $this->settings['post_types'] ) ) {
			return;
		}
		add_meta_box(
			'bookwize_metabox'
			, __( 'Bookwize', 'bookwize' )
			, array( $this, 'render_meta_box_content' )
			, $post_type
			, 'side'
		//, 'high'
		);

	}

	/**
	 * Save the meta when the post is saved.
	 */
	public function save( $post_id ) {

		/*
		 * We need to verify this came from the our screen and with proper authorization,
		 * because save_post can be triggered at other times.
		 */

		// Check if our nonce is set.
		if ( ! isset( $_POST['bookwize_inner_custom_box_nonce'] ) ) {
			return $post_id;
		}

		$nonce = $_POST['bookwize_inner_custom_box_nonce'];

		// Verify that the nonce is valid.
		if ( ! wp_verify_nonce( $nonce, 'bookwize_inner_custom_box' ) ) {
			return $post_id;
		}

		// If this is an autosave, our form has not been submitted,
		//     so we don't want to do anything.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return $post_id;
		}

		// Check the user's permissions.
		if ( 'page' == $_POST['post_type'] ) {

			if ( ! current_user_can( 'edit_page', $post_id ) ) {
				return $post_id;
			}

		} else {

			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return $post_id;
			}
		}

		/* OK, its safe for us to save the data now. */

		// Sanitize the user input.
		// Update the meta field.


		if ( isset( $_POST['bookwize_integrated_page_type'] ) ) {
			$page_type = sanitize_text_field( $_POST['bookwize_integrated_page_type'] );
			update_post_meta( $post_id, 'bookwize_integrated_page_type', $page_type );
		}

	}

	/**
	 * Render Meta Box content.
	 */
	public function render_meta_box_content( $post ) {

		// Add an nonce field so we can check for it later.
		wp_nonce_field( 'bookwize_inner_custom_box', 'bookwize_inner_custom_box_nonce' );

		// Use get_post_meta to retrieve an existing value from the database.
		$bookwize_integrated_page_type  = get_post_meta( $post->ID, 'bookwize_integrated_page_type', true );
		$bookwize_integrated_page_types = $this->settings['page_types'];

		ob_start();

		include plugin_dir_path( dirname( __FILE__ ) ) . 'admin/partials/bookwize-integrated-admin-meta-box.php';

		return ob_end_flush();
	}
}