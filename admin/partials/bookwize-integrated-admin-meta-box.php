<p>
	<label for="bookwize_integrated_page_type"><?php _e( 'Page type', 'bookwize' ); ?></label>
	<br/>
	<select id="bookwize_integrated_page_type" name="bookwize_integrated_page_type">
		<option value=""></option>
		<?php
		foreach ( $bookwize_integrated_page_types as $key => $value ) {
			?>
			<option value="<?php echo $key ?>" <?php selected( $key, $bookwize_integrated_page_type ); ?>>
				<?php echo $value; ?>
			</option>
			<?php
		}
		?>
	</select>
</p>