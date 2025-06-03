<template>
  <div>
    <div v-if="editor">
      <input type="text" placeholder="Subject" id="subject" v-model="subject">
      <button @click="editor.chain().focus().toggleBold().run()">
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()">
        Italic
      </button>
      <button @click="addImage">
        Add Image
      </button>
      <EditorContent :editor="editor" />
    </div>
    <div v-else>
      Loading editor...
    </div>
    <p>Current content:
    <pre>{{ editorContentHTML }}</pre>
    </p>
  </div>

  <div id="email-buttons">
    <button id="email" class="nav-button" type="submit">Send Email</button>
    <button id="weekly" @click="savePost">Save Weekly Post</button>
    <button id="admins" class="nav-button" type="submit">Send to Admins only</button>
  </div>

  <input v-if="viewFiles" type="file" @change="doImageUpload">
</template>

<script setup>
import { useTemplateRef, onMounted, ref } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import Image from '@tiptap/extension-image';
import { useAdmin } from '@/store/admin';

const admin = useAdmin();

const editorContentHTML = ref('');
const viewFiles = ref(false)

const editor = useEditor({

  immediatelyRender: false,
  content: `<p>Example Content</p>`,

  onUpdate: ({ editor }) => {
    const json = editor.getJSON()
    // send the content to an API here
  },
  props: {
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none', // Example styling
      },
    },
  },
  extensions: [
    StarterKit,
    Image,
    ImageResize
  ],
});

onMounted(() => {
  if (editor.value) {

    editorContentHTML.value = editor.value.getHTML();
    // You can interact with the editor instance here if needed
    console.log('Tiptap editor is ready:', editor.value);

    editor.value.on('update', ({ editor }) => {
      editorContentHTML.value = editor.getHTML();
    });
  }
});

function addImage() {
  viewFiles.value = !viewFiles.value
}

const doImageUpload = async (event) => {
  const file = event.target.files[0];

  if (file) {
    const path = `admin-uploads/images/${file}`
    const image = await admin.uploadImage(file, path);
    if (image) {

      editor.value.commands.setImage({ src: image });
      console.log('Uploaded Image URL in Component:', image);
      // You can now use this imageUrl to save to your database, display in the UI, etc.
    } else if (admin.uploadError) {
      console.error('Upload failed in Component:', admin.uploadError);
    }
  } else {
    alert('Please select an image file.');
  }
};

async function savePost() {

  const text = editorContentHTML.value;

  console.log('Saving post with subject:', subject.value);
  console.log('Post content:', text);

  await admin.SavePost(subject.value, text).then(() => {
    alert('Saved post to weekly.');
  }).catch((error) => {
    console.error('Error saving:', error);
    alert('Error saving.');
  });
}

</script>
