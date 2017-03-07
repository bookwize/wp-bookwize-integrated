<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://www.bookwize.com/
 * @since      1.0.0
 *
 * @package    Bookwize Integrated
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Bookwize Integrated
 */
class Bookwize_Integrated {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Bookwize_Integrated_Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $bookwize The string used to uniquely identify this plugin.
	 */
	protected $bookwize;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string $version The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->bookwize = 'bookwize-integrated';
		$this->version  = '1.0.0';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_bookwize() {
		return $this->bookwize;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();

		return new Bookwize_Integrated_Api();
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Bookwize_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Bookwize_Loader. Orchestrates the hooks of the plugin.
	 * - Bookwize_i18n. Defines internationalization functionality.
	 * - Bookwize_Admin. Defines all hooks for the admin area.
	 * - Bookwize_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'functions.php';

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-loader.php';

		/**
		 * The class responsible for caching functionality of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-cache.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-i18n.php';

		/**
		 * The class responsive for Bookwize settings page
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-settings.php';

		/**
		 * The class responsible for Bookwize languages
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-languages.php';

		/**
		 * The class responsible for Bookwize meta box
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-meta.php';

		/**
		 * The class responsible for Bookwize shortcode
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-shortcodes.php';


		/**
		 * The class responsible for Bookwize developer API
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-bookwize-integrated-api.php';


		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-bookwize-integrated-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-bookwize-public.php';

		$this->loader = new Bookwize_Integrated_Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Bookwize_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Bookwize_Integrated_i18n();
		$plugin_i18n->set_domain( $this->get_bookwize() );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {
		if ( current_user_can( 'manage_options' ) ) {
			$plugin_admin      = new Bookwize_Integrated_Admin( $this->get_bookwize(), $this->get_version() );
			$bookwize_settings = new Bookwize_Integrated_Settings();
			$bookwize_meta     = new Bookwize_Integrated_Meta();

			$this->loader->add_action( 'admin_init', $plugin_admin, 'admin_init' );
			$this->loader->add_action( 'admin_init', $bookwize_settings, 'admin_init' );
			$this->loader->add_action( 'admin_menu', $bookwize_settings, 'admin_menu' );


			$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
			$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

			$this->loader->add_action( 'load-post.php', $bookwize_meta, 'load_post' );
			$this->loader->add_action( 'load-post-new.php', $bookwize_meta, 'load_post' );
		}
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {
		$plugin_public = new Bookwize_Integrated_Public( $this->get_bookwize(), $this->get_version() );

		// initialize Bookwize Shortcodes
		$Bookwize_shortcodes = new Bookwize_Integrated_Shortcodes();

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

		if ( is_admin() === false || defined( 'DOING_AJAX' ) ) {
			$this->loader->add_action( 'init', $plugin_public, 'init', 999 );
		}
	}

}
