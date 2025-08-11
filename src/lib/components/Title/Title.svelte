<script>
	let { title = 'Title', line = true } = $props();
</script>

<section class="Title-container">
	<header class="Title-title">
		<span class="Title-title-bar"></span>
		<h2 class="Title-title-text">{title}</h2>
	</header>
	<hr class="Title-line" class:hidden={!line} />
</section>

<style lang="scss" scoped>
	.Title-container {
		width: 100%;
		display: flex;
		gap: 12px;
		align-items: center;
		.Title-title {
			display: flex;
			align-items: center;
			.Title-title-bar {
				width: 10px;
				height: 25px;
				border-radius: 6px;
				background-color: #0336ff;
			}
			.Title-title-text {
				font-size: 20px;
				font-weight: bold;
				margin-left: 13px;
			}
		}
		.Title-line {
			flex: 1;
			height: 2px;
			background-color: #e0e0e0;
			border: none;
		}
		.hidden {
			display: none;
		}
	}
</style>
