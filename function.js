const pdfCache = {}; // Temporary storage for cached PDFs

window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
	// Check if we have a cached version for the same HTML
	const hash = btoa(html.value); // Create a unique hash for the content
	if (pdfCache[hash]) {
		console.log("Returning cached PDF URL");
		return pdfCache[hash]; // Return cached PDF URL
	}

	console.log("Generating new PDF...");

	// FIDELITY MAPPING
	const fidelityMap = {
		low: 1,
		standard: 1.5,
		high: 2,
	};

	// DYNAMIC VALUES
	html = html.value ?? "No HTML set.";
	fileName = fileName.value ?? "file";
	format = format.value ?? "a4";
	zoom = zoom.value ?? "1";
	orientation = orientation.value ?? "portrait";
	margin = margin.value ?? "0";
	breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
	breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
	breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
	quality = fidelityMap[fidelity.value] ?? 1.5;
	customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

	// DOCUMENT DIMENSIONS
	const formatDimensions = {
		a4: [1240, 1754],
		letter: [1276, 1648],
		legal: [1276, 2102],
		ledger: [2551, 1648],
	};

	// GET FINAL DIMENSIONS
	const dimensions = customDimensions || formatDimensions[format];
	const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));

	// CSS FOR STYLING PDF PREVIEW AND DOWNLOAD BUTTON
	const customCSS = `
	body {
	  margin: 0!important
	}
	button#download {
	  position: fixed;
	  border-radius: 0.5rem;
	  font-size: 14px;
	  font-weight: 600;
	  color: #0d0d0d;
	  border: none;
	  font-family: 'Inter';
	  padding: 0px 12px;
	  height: 32px;
	  background: #ffffff;
	  top: 8px;
	  right: 8px;
	  cursor: pointer;
	}
	button#download:hover {
	  background: #f5f5f5;
	}
	button#download.downloading {
	  color: #ea580c;
	}
	button#download.done {
	  color: #16a34a;
	}
	::-webkit-scrollbar {
	  width: 5px;
	  background-color: rgb(0 0 0 / 8%);
	}
	::-webkit-scrollbar-thumb {
	  background-color: rgb(0 0 0 / 32%);
	  border-radius: 4px;
	}
	`;

	// HTML FOR PREVIEW AND PDF DOWNLOAD
	const originalHTML = `
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
	  <style>${customCSS}</style>
	  <div class="main">
	  <div class="header">
		<button class="button" id="download">Download</button>
	  </div>
	  <div id="content">${html}</div>
	  </div>
	  <script>
	  document.getElementById('download').addEventListener('click', function() {
		var element = document.getElementById('content');
		var button = this;
		button.innerText = 'Downloading...';
		button.className = 'downloading';
  
		var opt = {
		pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
		margin: ${margin},
		filename: '${fileName}',
		html2canvas: {
		  useCORS: true,
		  scale: ${quality}
		},
		jsPDF: {
		  unit: 'px',
		  orientation: '${orientation}',
		  format: [${finalDimensions}],
		  hotfixes: ['px_scaling']
		}
		};
		html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
		button.innerText = 'Done 🎉';
		button.className = 'done';
		setTimeout(function() { 
		  button.innerText = 'Download';
		  button.className = ''; 
		}, 2000);
		}).save();
	  });
	  </script>
	  `;
	var encodedHtml = encodeURIComponent(originalHTML);
	var pdfUrl = "data:text/html;charset=utf-8," + encodedHtml;

	// Store in cache before returning
	pdfCache[hash] = pdfUrl;
	return pdfUrl;
};
