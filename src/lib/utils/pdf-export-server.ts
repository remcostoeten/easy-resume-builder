import puppeteer from 'puppeteer'

export async function exportToPDFWithPuppeteer(resumeName: string, resumeHtml: string): Promise<Buffer> {
  let browser

  try {
    // Launch a headless browser with better configuration for server environments
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    })

    const page = await browser.newPage()

    // Set viewport to A4 size
    await page.setViewport({ width: 794, height: 1123 })

    // Create a complete HTML document with all styles inlined
    const completeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${resumeName}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.4;
              color: #000;
              background: #fff;
            }
            /* Reset styles for PDF */
            html, body, div, span, applet, object, iframe,
            h1, h2, h3, h4, h5, h6, p, blockquote, pre,
            a, abbr, acronym, address, big, cite, code,
            del, dfn, em, img, ins, kbd, q, s, samp,
            small, strike, strong, sub, sup, tt, var,
            b, u, i, center,
            dl, dt, dd, ol, ul, li,
            fieldset, form, label, legend,
            table, caption, tbody, tfoot, thead, tr, th, td,
            article, aside, canvas, details, embed,
            figure, figcaption, footer, header, hgroup,
            menu, nav, output, ruby, section, summary,
            time, mark, audio, video {
              margin: 0;
              padding: 0;
              border: 0;
              font-size: 100%;
              font: inherit;
              vertical-align: baseline;
            }
            article, aside, details, figcaption, figure,
            footer, header, hgroup, menu, nav, section {
              display: block;
            }
            body {
              line-height: 1;
            }
            ol, ul {
              list-style: none;
            }
            blockquote, q {
              quotes: none;
            }
            blockquote:before, blockquote:after,
            q:before, q:after {
              content: '';
              content: none;
            }
            table {
              border-collapse: collapse;
              border-spacing: 0;
            }
          </style>
        </head>
        <body>
          ${resumeHtml}
        </body>
      </html>
    `

    // Set the complete HTML content
    await page.setContent(completeHtml, {
      waitUntil: 'networkidle0',
      timeout: 10000
    })

    // Wait a bit more to ensure all resources are loaded
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate PDF with better options
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in'
      },
      scale: 1,
      displayHeaderFooter: false,
      pageRanges: '',
      width: '210mm',
      height: '297mm'
    })

    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error('Puppeteer PDF generation error:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
