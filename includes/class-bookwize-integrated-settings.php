<?php
class Bookwize_Integrated_Settings {

	// A config array containing the required options for connection
	public $settings = [ ];

	// Add Wp Action Hooks
	public function __construct() {

		$bookwize_languages = new Bookwize_Integrated_Languages();
		$languages          = $bookwize_languages->get_languages();

		$this->settings = [
			[
				'name'     => 'auth',
				'section'  => [ 'auth_section', 'Authentication', 'Credentials for Bookwize' ],
				'settings' => [
					[ 'bw_hotelId', 'Hotel ID', 'text', 'Hotel Id' ],
					[ 'bw_apiKey', 'API KEY', 'text', 'API Key' ],
				]
			],
			[
				'name'     => 'frontend',
				'section'  => [ 'frontend_section', 'Front End Configuration' ],
				'settings' => [
					['bw_currency', 'Default Currency', 'text', 'eg. EUR' ],
					['bw_debug', 'Debug', 'checkbox', '<b>Caution:</b> In DEBUG mode Adwords Tracking is disabled.'],
					['bw_googleAnalyticsId', 'Google Analytics ID', 'text', ''],
                    ['bw_button_color', 'Custom Color ', 'color']
				],
			]
		];
	}

	// Creates Bookwize Settings Page
	public function admin_menu() {

		add_menu_page(
			'Settings',
			'Bookwize Integrated',
			'manage_options',
			'bookwize-integrated',
			[ &$this, 'render_options_page' ]
		);
	}

	// Sets Social Media Connection Settings
	public function admin_init() {

		$this->set_settings( $this->settings );

		flush_rewrite_rules();
	}

	public function set_settings( $settings ) {

		foreach ( $settings as $setting ) {
			$section = $setting['section'];
			add_settings_section( $section[0], $section[1], [ &$this, 'render_settings_section' ], 'bookwize-integrated' );

			foreach ( $setting['settings'] as $option ) {

				add_settings_field(
					$option[0], $option[1], [ &$this, 'render_settings_fields' ],
					'bookwize-integrated',
					$section[0],
					$option
				);

				register_setting( 'bookwize-integrated', $option[0] );
			}
		}
	}

	// Render Content for Bookwize IntegratedSettings Page
	public function render_options_page() {

		include plugin_dir_path( dirname( __FILE__ ) ) . 'admin/partials/bookwize-integrated-admin-settings.php';
	}

	// Render input fields foreach registered setting
	public function render_settings_fields( $field ) {

		switch ( $field[2] ) {
			case 'checkbox':
				echo '<input name="' . $field[0] . '" id="' . $field[0] . '" type="checkbox" value="1" class="code" ' . checked( 1, get_option( $field[0] ), false );
				$this->_print_attrs( $field );
				echo '/>';
				break;
			case 'select':
				echo '<select  name="' . $field[0] . '" id="' . $field[0] . '" class="code">';
				echo '<option value=""></option>';
				if ( isset( $field[4]['options'] ) ) {
					foreach ( $field[4]['options'] as $value => $option ) {
						echo '<option value="' . $value . '"' . selected( $value, get_option( $field[0] ), false ) . '>' . $option . '</option>';
					}
				}
				echo '</select>';
				break;
			case 'textarea' :
				echo '<textarea class="regular-text code" cols="40" rows="7" name="' . $field[0] . '" id="' . $field[0] . '" ' . $this->_print_attrs( $field ) . '>'
				     . get_option( $field[0] )
				     . '</textarea>';
				break;
			default :
				echo '<input class="regular-text code" name="' . $field[0] . '" id="' . $field[0] . '" type="text" value="' . get_option( $field[0] ) . '"';
				$this->_print_attrs( $field );
				echo '/>';
				break;
		}

		// display extra info texts
		foreach ( $this->settings as $settings ) {
			foreach ( $settings['settings'] as $option ) {
				if ( $option[0] == $field[0] && isset( $option[3] ) ) {
					echo '<p class="description">' . $option[3] . '</p>';
				}
			}
		}
	}

	public function render_settings_section( $field ) {
		// display extra info texts
		foreach ( $this->settings as $settings ) {
			if ( $settings['section'][0] == $field['id'] && isset( $settings['section'][2] ) ) {
				echo '<p class="description">' . $settings['section'][2] . '</p>';
			}
		}
	}

	public function show_flash_message( $message = 'Updated' ) {
		include plugin_dir_path( dirname( __FILE__ ) ) . 'admin/partials/bookwize-integrated-admin-flash-message.php';
	}

	public function render_options_subpage_settings() {
		include plugin_dir_path( dirname( __FILE__ ) ) . 'admin/partials/bookwize-integrated-admin-settings.php';
	}

	public function render_options_subpage_localization() {

		include plugin_dir_path( dirname( __FILE__ ) ) . 'admin/partials/bookwize-admin-localization.php';
	}

	protected function _print_attrs( $field ) {
		if ( isset( $field[4] ) && is_array( $field[4] ) ) {
			foreach ( $field[4] as $key => $value ) {
				echo ' ' . $key . '="' . esc_attr( $value ) . '"';
			}
		}
	}
}
