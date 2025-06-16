import './styles.scss'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useState } from 'react'
import axiosClient from '../utils/axiosClient'
import { toast } from 'react-toastify'

const MenuBar = ({topic,title}) => {
  const { editor } = useCurrentEditor()
  const [loading,setLoading] = useState(false)
  const [submitted,setSubmitted] = useState("")

  if (!editor) {
    return null
  }

  const handleContentSubmit = async () => {
    setLoading(true)
    const html = editor.getHTML();
    try{
    const response = await axiosClient.post('/content/upload',{
        topic:topic,
        content:html,
        title:title?.trim()
    })
    setSubmitted("Content Submitted SuccessFully")
     }
    catch(err)
    {
        console.log("Error:"+err)
        toast.error(err.response.data)
    }
    finally{
        setLoading(false)
    }
    // You could also send this to an API here
  };

  // Define color options
  const colors = [
    { name: 'Purple', value: '#958DF1' },
    { name: 'Red', value: '#F98181' },
    { name: 'Orange', value: '#FBBC88' },
    { name: 'Yellow', value: '#FAF594' },
    { name: 'Green', value: '#70CFF8' },
    { name: 'Blue', value: '#94FADB' },
    { name: 'Default', value: '#000000' }
  ]
if(submitted!="") return (<> <div className='p-4 bg-success'>{submitted}</div></>)
  return (
    <div className="editor-menu bg-gray-900 border-b border-gray-200 px-2 sm:px-4 rounded-t-lg">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-between">
        {/* Text formatting */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-md shadow-sm btn btn-sm">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-1 ${editor.isActive('bold') ? 'bg-gray-200 text-gray-800' : ''} hover:bg-gray-200 rounded hover:text-gray-800`}
            title="Bold"
            aria-label="Bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-1 ${editor.isActive('italic') ? 'bg-gray-200 text-gray-800' : ''} hover:bg-gray-200 rounded hover:text-gray-800`}
            title="Italic"
            aria-label="Italic"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="4" x2="10" y2="4"></line>
              <line x1="14" y1="20" x2="5" y2="20"></line>
              <line x1="15" y1="4" x2="9" y2="20"></line>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-1 ${editor.isActive('strike') ? 'bg-gray-200 text-gray-800' : ''} hover:bg-gray-200 rounded hover:text-gray-800`}
            title="Strikethrough"
            aria-label="Strikethrough"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34z"></path>
            </svg>
          </button>
        </div>

        {/* Headings - Changed to dropdown on small screens */}
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-sm m-1 bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
              <path d="M3 12h18M3 6h18M3 18h18"></path>
            </svg>
            <span className="hidden sm:inline">Headings</span>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-52">
            <li><button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'active' : ''}>Paragraph</button></li>
            <li><button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>Heading 1</button></li>
            <li><button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>Heading 2</button></li>
            <li><button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}>Heading 3</button></li>
            <li><button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={editor.isActive('heading', { level: 4 }) ? 'active' : ''}>Heading 4</button></li>
            <li><button onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={editor.isActive('heading', { level: 5 }) ? 'active' : ''}>Heading 5</button></li>
            <li><button onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={editor.isActive('heading', { level: 6 }) ? 'active' : ''}>Heading 6</button></li>
          </ul>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 bg-gray-800 btn btn-sm rounded-md shadow-sm">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-800' : ''} hover:bg-gray-200 rounded hover:text-gray-800`}
            title="Bullet List"
            aria-label="Bullet List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-800' : ''} hover:bg-gray-200 rounded hover:text-gray-800`}
            title="Numbered List"
            aria-label="Numbered List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="6" x2="21" y2="6"></line>
              <line x1="10" y1="12" x2="21" y2="12"></line>
              <line x1="10" y1="18" x2="21" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
          </button>
        </div>

        {/* Blocks - Combined into dropdown on small screens */}
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn btn-sm m-1 bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            <span className="hidden sm:inline">Blocks</span>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-52">
            <li>
              <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'active' : ''}
              >
                Code Block
              </button>
            </li>
            <li>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'active' : ''}
              >
                Blockquote
              </button>
            </li>
            <li>
              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                Horizontal Rule
              </button>
            </li>
          </ul>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 bg-gray-800 btn btn-sm rounded-md shadow-sm">
          <select
            onChange={(e) => {
              const color = e.target.value
              if (color === 'default') {
                editor.chain().focus().unsetColor().run()
              } else {
                editor.chain().focus().setColor(color).run()
              }
            }}
            value={editor.getAttributes('textStyle').color || 'default'}
            className="bg-gray-800 text-gray-200 hover:bg-gray-200 hover:text-gray-800 rounded text-xs sm:text-sm"
          >
            <option value="default">Color</option>
            {colors.map((color) => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions - Undo/Redo */}
        <div className="flex items-center gap-1 bg-gray-800 btn btn-sm rounded-md shadow-sm">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1 hover:bg-gray-200 rounded hover:text-gray-800"
            title="Undo"
            aria-label="Undo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10h10a4 4 0 0 1 0 8H3"></path>
              <path d="M7 6l-4-4-4 4"></path>
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1 hover:bg-gray-200 rounded hover:text-gray-800"
            title="Redo"
            aria-label="Redo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10H11a4 4 0 0 0 0 8h10"></path>
              <path d="M17 6l4-4-4-4"></path>
            </svg>
          </button>
        </div>

        {/* Submit button */}
        <div>
          <button
            onClick={handleContentSubmit}
            className={`btn btn-sm btn-error ${loading ? "bg-gray-700":""}`}
            title="Submit Content"
            aria-label="Submit Content"
          >
            <span className="hidden sm:inline">{ loading ? "Submitting":"Submit"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
              <path d="M22 2L11 13"></path>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
]

// const content = `
// <h2>
//   Hi there,
// </h2>
// <p>
//   this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
// </p>
// <ul>
//   <li>
//     That's a bullet list with one …
//   </li>
//   <li>
//     … or two list items.
//   </li>
// </ul>
// <p>
//   Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
// </p>
// <pre><code class="language-css">body {
//   display: none;
// }</code></pre>
// <p>
//   I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
// </p>
// <blockquote>
//   Wow, that's amazing. Good work! 👏
//   <br />
//   — Your Team
// </blockquote>
// `

export default ({topic,title,content}) => {

  return (
    <div className="editor-container max-w-4xl mx-auto my-8 border border-gray-200 rounded-lg shadow-sm mt-18">
      <EditorProvider 
        slotBefore={<MenuBar topic={topic} title={title} />} 
        extensions={extensions} 
        content={content}
        editorProps={{
          attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-6 min-h-[300px]',
          },
        }}
      ></EditorProvider>
    </div>
  )
}

