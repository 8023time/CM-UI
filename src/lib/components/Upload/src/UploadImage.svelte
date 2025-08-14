<script>
	import { toast } from '$lib/components/Toast/src/Toast.js';
	import { createEventDispatcher } from 'svelte';
	import "../style"

	let {
		required = false,
		show_label = false,
		show_message = false,
		mode = 'upload',
		drag = false,
		disabled = false,
		label = '',
		accept = 'image/*',
		message = '仅支持 PDF、JPG 和 PNG 格式。最大文件尺寸 10 MB。',
		previewUrl = '',
		limit_size = 10 // 1MB
	} = $props();

	const dispatch = createEventDispatcher();

	function handleChange(event) {
		const file = event.target.files[0];
		if (!file) return;
		if (file.size > limit_size * 1024 * 1024) {
			toast.error(`文件大小不能超过 ${limit_size} MB`);
			return;
		}
		previewUrl = URL.createObjectURL(file);
		dispatch('file', { file });
	}
</script>

<div class="UploadImage-box">
	{#if show_label && label}
		<div class="label-text">
			{#if required}<span class="required">*</span>{/if}
			<label class="label" for="upload-image">{label}</label>
		</div>
	{/if}
	<div
		class="UploadImage-button"
		style:background-image={previewUrl ? `url(${previewUrl})` : 'none'}
		style:background-size="cover"
		style:background-position="center"
	>
		<input type="file" {accept} onchange={handleChange} {disabled} />
		{#if !previewUrl}
			<div class="plus">+</div>
			{#if mode == 'upload'}
				<div class="text">Upload</div>
			{/if}
			{#if mode == 'preview'}
				<div class="text">暂无图片</div>
			{/if}
		{/if}
	</div>
	{#if show_message}
		<div class="UploadImage-message">{message}</div>
	{/if}
</div>
