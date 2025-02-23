const pdfCache = {}; // This object will temporarily store cached PDFs

window.function = async function (htmlContent) {
    const hash = btoa(htmlContent); // Generate a unique hash based on the content
    
    // Check if this HTML content has already been converted
    if (pdfCache[hash]) {
        console.log("Returning cached PDF URL");
        return pdfCache[hash]; // Return the previously cached PDF URL
    }

    console.log("Generating new PDF...");
    
    // Encode the HTML content for URL passing
    const encodedHtml = encodeURIComponent(htmlContent);
    
    // Construct the PDF Generator URL
    const pdfGeneratorUrl = `https://bizziytech.github.io/bizziyhtml2pdf/?html=${encodedHtml}`;

    // Store the generated URL in the cache
    pdfCache[hash] = pdfGeneratorUrl;

    return pdfGeneratorUrl; // Return the new PDF URL
};
