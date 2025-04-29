import React, { useState, useEffect } from 'react';
import { CldUploadWidget, CldImage } from 'next-cloudinary/dist';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function WriteBlog() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [token, setToken] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadType, setUploadType] = useState('image');  
  const router = useRouter();

  useEffect(() => {
    const tokenValue = localStorage.getItem('token');
    setToken(tokenValue);
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleTextChange = (e) => setText(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = (result) => {
    if (result.event === 'success') {
      setUploadedImage(result.info.secure_url);
    }
  };

  const handleSubmit = async () => {
<<<<<<< HEAD
=======
    if(window.confirm("Do you want to publish your blog?")){
>>>>>>> 65fc17c60127c3bf55944608176442f5e8d8176b
    try {
      const res = await axios.post('/api/writeblogroute', {
        title: title,
        blogText: text,
        author: token,
        url: uploadedImage,
        type : uploadType
      });
      console.log(res);
      alert('Blog published successfully!');
      router.push('/Home');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={{ width: 'auto' }}>
          <header style={headerStyle}>
            <h1 style={titleStyle}>Create Your Blog Post</h1>
          </header>
          <div style={formStyle}>
            <div style={inputContainerStyle}>
              <label htmlFor="title-input" style={labelStyle}>
                Title
              </label>
              <textarea
                id="title-input"
                value={title}
                onChange={handleTitleChange}
                placeholder="Write your title here..."
                style={titleInputStyle}
              />
            </div>
            <div style={inputContainerStyle}>
              <label htmlFor="text-input" style={labelStyle}>
                Blog Text
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={handleTextChange}
                placeholder="Write your blog post here..."
                style={textInputStyle}
              />
            </div>
            <div style={inputContainerStyle}>
              <label htmlFor="upload-type" style={labelStyle}>
                Upload Type
              </label>
              <select
                id="upload-type"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                style={selectStyle}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            {uploadType === 'image' && (
              <div style={inputContainerStyle}>
                <label htmlFor="file-input" style={labelStyle}>
                  Upload Image
                </label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onUpload={handleUpload}
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  resourceType="image"
                >
                  {({ open }) => (
                    <button onClick={() => open()}>Upload Image</button>
                  )}
                </CldUploadWidget>
              </div>
            )}
            {uploadType === 'video' && (
              <div style={inputContainerStyle}>
                <label htmlFor="file-input" style={labelStyle}>
                  Upload Video
                </label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onUpload={handleUpload}
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  resourceType="video"
                >
                  {({ open }) => (
                    <button onClick={() => open()}>Upload Video</button>
                  )}
                </CldUploadWidget>
              </div>
            )}
            {uploadedImage && (
              <div style={inputContainerStyle}>
                <CldImage
                  src={uploadedImage}
                  width="25"
                  height="25"
                  crop="fill"
                  alt="Uploaded Image"
                />
              </div>
            )}
            <button onClick={handleSubmit} style={publishButtonStyle}>
              Publish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100vh',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #C9FFF8 0%, #FA8275 100%)',
  fontFamily: 'Poppins, sans-serif',
};

const headerStyle = {
  marginBottom: '20px',
};

const titleStyle = {
  fontSize: '2.5em',
  color: '#00bfa5',
  animation: 'fadeIn 2s ease-in-out',
  fontFamily: 'Poppins, sans-serif',
};

const formStyle = {
  opacity: '0.9',
  width: 'auto',
  maxWidth: '600px',
  background: '#f9f9f9',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  animation: 'slideIn 1.5s ease-in-out',
};

const inputContainerStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: 'grey',
};

const titleInputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '1em',
  transition: 'border-color 0.3s',
  color: 'black',
  backgroundColor: 'white',
  height: '50px',
  fontFamily: 'Poppins, sans-serif',
};

const textInputStyle = {
  width: '100%',
  padding: '15px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '1em',
  transition: 'border-color 0.3s',
  color: 'black',
  backgroundColor: 'white',
  height: '120px',
  fontFamily: 'Poppins, sans-serif',
};

textInputStyle[':focus'] = {
  borderColor: '#00bfa5',
  outline: 'none',
};

const fileInputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '1em',
  transition: 'border-color 0.3s',
  color: 'black',
  backgroundColor: 'white',
};

fileInputStyle[':focus'] = {
  borderColor: '#00bfa5',
  outline: 'none',
};

const publishButtonStyle = {
  width: '100%',
  padding: '15px',
  border: 'none',
  borderRadius: '5px',
  background: '#00bfa5',
  color: 'white',
  fontSize: '1.2em',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.3s',
  fontFamily: 'Poppins, sans-serif',
};

publishButtonStyle[':hover'] = {
  background: '#008c7a',
  transform: 'scale(1.05)',
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '1em',
  transition: 'border-color 0.3s',
  color: 'black',
  backgroundColor: 'white',
};

selectStyle[':focus'] = {
  borderColor: '#00bfa5',
  outline: 'none',
};
