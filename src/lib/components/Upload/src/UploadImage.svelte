<script>
	import { toast } from '$lib/components/Toast/src/Toast.js';
	import { createEventDispatcher } from 'svelte';
	/**
	 * @description 上传图片组件组件
	 * @param {Boolean} required - 是否必填   显示红色 * 标记
	 * @param {Boolean} show_label - 是否显示标签
	 * @param {String} mode - 模式，upload 上传，  preview 后端返回的url传递到previewUrl属性，preview 预览
	 * @param {String} label - 标签文字
	 * @param {Boolean} disabled - 是否禁用
	 * @param {Boolean} drag - 是否支持拖拽上传
	 * @param {String} accept - 接受的文件类型
	 * @param {String} message - 提示信息
	 * @param {String} previewUrl - 预览图地址
	 */
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

<style lang="scss" scoped>
	.UploadImage-box {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.label-text {
		display: flex;
	}
	.required {
		color: red;
	}
	.label {
		font-size: 13px;
		margin-right: 0.5rem;
	}
	.UploadImage-button {
		width: 150px;
		height: 100px;
		border: 1px dashed #ccc;
		border-radius: 6px;
		background-color: #f9f9f9;
		cursor: pointer;
		text-align: center;
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #666;
		position: relative;
		background-repeat: no-repeat;
		&:hover {
			border: 1px dashed #0052d9;
			background-color: #ecf0f7;
		}
	}
	.UploadImage-button input {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
		top: 0;
		left: 0;
		cursor: pointer;
	}
	.UploadImage-button .plus {
		font-size: 24px;
		margin-bottom: 4px;
	}
	.UploadImage-button .text {
		font-size: 14px;
	}
	.UploadImage-message {
		font-size: 13px;
		color: #888;
	}
</style>
