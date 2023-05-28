import React, { useState } from 'react';
import axios from 'axios';

function AudioRecorder() {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const newMediaRecorder = new MediaRecorder(stream);
                setMediaRecorder(newMediaRecorder);
                newMediaRecorder.start();

                newMediaRecorder.addEventListener("dataavailable", event => {
                    setAudioChunks(oldAudioChunks => [...oldAudioChunks, event.data]);
                });

                newMediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    uploadAudio(audioBlob);
                    console.log(audioBlob);
                });
            });
    }

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
        }
    }

    const uploadAudio = (audioBlob) => {
        const data = new FormData();
        console.log(data);
        data.append('file', audioBlob, 'audio.wav');
        console.log(FormData);

        axios.post('http://localhost:8000/transcript/upload/', data)  // Replace with your FastAPI endpoint
             .then(response => {
                 // handle response
             })
             .catch(error => {
                 console.error("Error uploading audio file: ", error);
             });
    }

    return (
        <div>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
        </div>
    )
}

export default AudioRecorder;
