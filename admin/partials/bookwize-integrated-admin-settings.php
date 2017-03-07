<h2>Bookwize Integrated Settings</h2>

<form method="POST" action="options.php">
	<?php
	settings_fields( 'bookwize-integrated' );
	do_settings_sections( 'bookwize-integrated' );
	submit_button();
	?>
</form>
