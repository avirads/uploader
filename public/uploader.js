const { Uppy, Dashboard, XHRUpload } = window.Uppy;

const uppy = new Uppy({
    id: 'secure-uploader',
    autoProceed: false,
    restrictions: {
        maxFileSize: 10 * 1024 * 1024, // Requirement 3: 10MB
        maxTotalFileSize: 500 * 1024 * 1024, // Requirement 7: 500MB
        allowedFileTypes: ['image/jpeg', 'image/png', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.rtf', '.pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/rtf', 'application/pdf'],
    }
})
    .use(Dashboard, {
        target: '#uppy-mount',
        inline: true,
        proudlyDisplayPoweredByUppy: false,
        width: '100%',
        height: 500,
        theme: 'dark',

    })
    .use(XHRUpload, {
        endpoint: '/upload',
        fieldName: 'files',
        bundle: true,
        formData: true,
    });

// Toast Helper
function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || (() => {
        const c = document.createElement('div');
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
    })();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="msg">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Handle server response for virus scan and results
uppy.on('upload-success', (file, response) => {
    const body = response.body;
    if (body && body.results) {
        body.results.forEach(res => {
            if (res.status === 'infected') {
                // Requirement 4 & 9: Handle infected file
                showToast(`Threat detected in "${res.name}". File destroyed for safety.`, 'error');
            } else if (res.status === 'rejected') {
                showToast(`File "${res.name}" rejected: ${res.reason}`, 'error');
            }
        });
    }
});

uppy.on('upload-error', (file, error, response) => {
    const errorMsg = response?.body?.error || error.message || 'Upload failed';
    showToast(`Error: ${errorMsg}`, 'error');
});

uppy.on('complete', (result) => {
    if (result.successful.length > 0) {
        const count = result.successful.length;
        showToast(`Successfully processed ${count} file${count > 1 ? 's' : ''}.`, 'success');
    }
});

