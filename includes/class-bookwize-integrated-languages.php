<?php

/**
 * @since      1.0.0
 * @package    Bookwize Integrated
 */
class Bookwize_Integrated_Languages {
	/**
	* Default supported languages
	**/
	public $languages = [
		[
			"locale"      => "de",
			"description" => "German",
			"country"     => "Germany",
			"culture"     => "de-DE"
		],
		[
			"locale"      => "el",
			"description" => "Greek",
			"country"     => "Greece",
			"culture"     => "el-GR"
		],
		[
			"locale"      => "en",
			"description" => "English",
			"country"     => "United States",
			"culture"     => "en-US"
		],
		[
			"locale"      => "es",
			"description" => "Spanish",
			"country"     => "Spain, International Sort",
			"culture"     => "es-ES"
		],
		[
			"locale"      => "fi",
			"description" => "Finnish",
			"country"     => "Finland",
			"culture"     => "fi-FI"
		],
		[
			"locale"      => "fr",
			"description" => "French",
			"country"     => "France",
			"culture"     => "fr-FR"
		],
		[
			"locale"      => "it",
			"description" => "Italian",
			"country"     => "Italy",
			"culture"     => "it-IT"
		],
		[
			"locale"      => "pt",
			"description" => "Portuguese",
			"country"     => "Brazil",
			"culture"     => "pt-BR"
		],
		[
			"locale"      => "ru",
			"description" => "Russian",
			"country"     => "Russia",
			"culture"     => "ru-RU"
		]
	];

	public function __construct() {
		return $this;
	}

	public function get_languages() {

		$languages = $this->_get_default_languages();

		if ( class_exists( 'SitePress' ) ) {
			$languages = $this->_get_wpml_languages();
		}

		return $languages;
	}

	/**
	 * @return array of $languages
	 */
	protected function _get_default_languages() {
		$languages  = [ ];
		$_languages = $this->languages;
		foreach ( $_languages as $key => $language ) {
			$languages[ $language['culture'] ] = $language['description'];
		}

		return $languages;
	}

	/**
	 * @return array of WPML active languages
	 */
	protected function _get_wpml_languages() {
		$languages = [ ];
		if ( class_exists( 'SitePress' ) ) {
			$languages = apply_filters( 'wpml_active_languages', null );
			if ( ! empty( $languages ) ) {
				//todo: epeidh kanw 2 instances den exoun kai ta 2 ta idia data
				array_walk( $languages, function ( &$item ) {
					if ( isset( $item['english_name'] ) ) {
						$item = $item['english_name'];
					}
					if ( isset( $item['native_name'] ) ) {
						$item = $item['native_name'];
					}
				} );
			}
		}

		return $languages;
	}
}
