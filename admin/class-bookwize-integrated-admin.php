<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.bookwize.com/
 * @since      1.0.0
 *
 * @package    Bookwize  Integrated
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Bookwize Integrated
 * @author     Bookwize
 */
class Bookwize_Integrated_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $bookwize The ID of this plugin.
	 */
	private $bookwize;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 *
	 * @param      string $bookwize The name of this plugin.
	 * @param      string $version The version of this plugin.
	 */
	public function __construct( $bookwize, $version ) {

		$this->bookwize = $bookwize;
		$this->version  = $version;
		$this->meta     = new Bookwize_Integrated_Meta();
	}

	public function admin_init() {
		add_action( 'admin_head', [ &$this, 'admin_head' ], 10, 2 );
	}

	public function manage_columns( $columns ) {
		$columns['bw_page_type'] = _x( 'HP Page', 'Bookwize', 'bw' );

		return $columns;
	}

	public function manage_custom_column( $name ) {
		global $post;

		switch ( $name ) {
			case 'bw_page_type':
				$page_type = get_post_meta( $post->ID, 'bookwize_integrated_page_type', true );
				if ( $page_type ) {
					echo $this->meta->settings['page_types'][ $page_type ];
				}
				break;
		}
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Bookwize_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Bookwize_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
        wp_enqueue_style('wp-color-picker');
		wp_enqueue_style( $this->bookwize, plugin_dir_url( __FILE__ ) . 'css/bookwize-integrated-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Bookwize_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Bookwize_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
        wp_enqueue_script('wp-color-picker', plugins_url('wp-color-picker-script.js', __FILE__), array('farbtastic'), false, true);
		wp_enqueue_script( $this->bookwize, plugin_dir_url( __FILE__ ) . 'js/bookwize-integrated-admin.js', array(), $this->version, true );
	}

	public function register_metabox() {

		$bookwize_meta = new Bookwize_Integrated_Meta();

		add_action( 'load-post.php', array( &$bookwize_meta ) );
		add_action( 'load-post-new.php', array( &$bookwize_meta ) );
	}

	public function admin_head() {

		$settings = [
			'apiBaseUrl' => get_option( 'bw_apiBaseUrl' ),
			'apikey'     => get_option( 'bw_apiKey' ),
			'hotelId'    => get_option( 'bw_hotelId' ),
			'properties' => [ ]
		];

		?>
		<script type="text/javascript">
			<?php echo 'var bookwize = ' . json_encode( $settings ); ?>
		</script>
		<?php
	}

}
