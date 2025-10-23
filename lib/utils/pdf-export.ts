import jsPDF from "jspdf"

export async function exportToPDF(fileName = "resume") {
  const element = document.getElementById("resume-preview")

  if (!element) {
    throw new Error("Resume preview element not found")
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  })

  const pageWidth = 210
  const pageHeight = 297
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  function addText(
    text: string,
    x: number,
    y: number,
    options: {
      fontSize?: number
      fontStyle?: string
      color?: [number, number, number]
      align?: "left" | "center" | "right"
      maxWidth?: number
      link?: string
      lineHeight?: number
    } = {}
  ) {
    const fontSize = options.fontSize || 10
    const fontStyle = options.fontStyle || "normal"
    const color = options.color || [0, 0, 0]
    const align = options.align || "left"
    const maxWidth = options.maxWidth || contentWidth
    const lineHeight = options.lineHeight || fontSize * 0.35

    pdf.setFontSize(fontSize)
    pdf.setFont("helvetica", fontStyle)
    pdf.setTextColor(color[0], color[1], color[2])

    // Split text into lines for proper wrapping
    const lines = pdf.splitTextToSize(text, maxWidth)

    if (options.link) {
      pdf.textWithLink(lines, x, y, { url: options.link, align })
    } else {
      pdf.text(lines, x, y, { align })
    }

    // Return the height used for positioning next elements
    return lines.length * lineHeight
  }

  function addLine(y: number, thickness: number = 0.5, color: [number, number, number] = [0, 0, 0]) {
    pdf.setDrawColor(color[0], color[1], color[2])
    pdf.setLineWidth(thickness)
    pdf.line(margin, y, pageWidth - margin, y)
  }

  function checkPageBreak(requiredSpace: number) {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  function addSpacing(space: number) {
    yPosition += space
  }

  try {
    const sections = element.querySelectorAll(':scope > div')
    
    sections.forEach((section) => {
      const classes = Array.from(section.classList)
      
      if (section.querySelector('h1')) {
        const h1 = section.querySelector('h1')
        const subtitle = section.querySelector('p.text-lg')
        const contactDiv = section.querySelector('.flex.flex-wrap')
        
        if (h1) {
          const nameHeight = addText(h1.textContent || '', margin, yPosition, {
            fontSize: 24,
            fontStyle: 'bold',
            lineHeight: 10,
          })
          yPosition += nameHeight + 4
        }

        if (subtitle) {
          const titleHeight = addText(subtitle.textContent || '', margin, yPosition, {
            fontSize: 14,
            color: [55, 65, 81],
            lineHeight: 6,
          })
          yPosition += titleHeight + 4
        }
        
        if (contactDiv) {
          const contactItems = contactDiv.querySelectorAll('.flex.items-center')
          let xPos = margin
          let maxContactHeight = 0

          contactItems.forEach((item, index) => {
            const text = item.querySelector('span')?.textContent || ''
            const itemHeight = addText(text, xPos, yPosition, {
              fontSize: 9,
              color: [75, 85, 99],
              lineHeight: 4,
            })
            maxContactHeight = Math.max(maxContactHeight, itemHeight)
            xPos += 50
            if ((index + 1) % 3 === 0) {
              xPos = margin
              yPosition += maxContactHeight + 2
              maxContactHeight = 0
            }
          })

          if (contactItems.length % 3 !== 0) {
            yPosition += maxContactHeight + 4
          } else {
            yPosition += 4
          }
        }
        
        addLine(yPosition, 1)
        yPosition += 8
      }
      else if (section.querySelector('h2')) {
        checkPageBreak(15)
        
        const h2 = section.querySelector('h2')
        if (h2) {
          const sectionTitle = h2.textContent || ''
          const titleHeight = addText(sectionTitle, margin, yPosition, {
            fontSize: 12,
            fontStyle: 'bold',
            lineHeight: 5,
          })
          addLine(yPosition + 2, 0.5, [209, 213, 219])
          yPosition += titleHeight + 6
        }
        
        const summaryText = section.querySelector('p.leading-relaxed')
        if (summaryText) {
          checkPageBreak(15)
          const lines = pdf.splitTextToSize(summaryText.textContent || '', contentWidth)
          lines.forEach((line: string, index: number) => {
            const lineHeight = addText(line, margin, yPosition, {
              fontSize: 10,
              color: [31, 41, 55],
              lineHeight: 5,
            })
            yPosition += lineHeight
            if (index < lines.length - 1) {
              addSpacing(2) // Add small gap between lines
            }
          })
          addSpacing(6) // Add spacing after summary
        }
        
        const entries = section.querySelectorAll('.space-y-4 > div')
        entries.forEach((entry) => {
          checkPageBreak(20)
          
          const header = entry.querySelector('.flex.justify-between')
          if (header) {
            const leftDiv = header.querySelector('div:first-child')
            const rightDiv = header.querySelector('div:last-child')
            
            if (leftDiv) {
              const title = leftDiv.querySelector('h3, .font-bold')
              const subtitle = leftDiv.querySelector('p.text-sm, .text-sm')
              
              if (title) {
                const titleHeight = addText(title.textContent || '', margin, yPosition, {
                  fontSize: 11,
                  fontStyle: 'bold',
                  lineHeight: 5,
                })
                yPosition += titleHeight + 2
              }

              if (rightDiv) {
                const rightText = Array.from(rightDiv.querySelectorAll('p'))
                  .map(p => p.textContent)
                  .filter(Boolean)
                  .join(' | ')
                const rightHeight = addText(rightText, pageWidth - margin, yPosition - 2, {
                  fontSize: 9,
                  color: [75, 85, 99],
                  align: 'right',
                  lineHeight: 4,
                })
                // Keep yPosition aligned with the title
              }

              if (subtitle) {
                const subtitleHeight = addText(subtitle.textContent || '', margin, yPosition, {
                  fontSize: 10,
                  fontStyle: 'bold',
                  color: [55, 65, 81],
                  lineHeight: 5,
                })
                yPosition += subtitleHeight + 4
              }
            }
          }
          
          const ul = entry.querySelector('ul.list-disc')
          if (ul) {
            const items = ul.querySelectorAll('li')
            items.forEach((li) => {
              checkPageBreak(8)
              const bulletText = li.textContent || ''
              const bulletHeight = addText('• ' + bulletText, margin + 5, yPosition, {
                fontSize: 9,
                color: [31, 41, 55],
                maxWidth: contentWidth - 5,
                lineHeight: 5,
              })
              yPosition += bulletHeight + 2
            })
          }
          
          const skillsLine = entry.querySelector('p.text-xs')
          if (skillsLine) {
            checkPageBreak(6)
            const skillsHeight = addText(skillsLine.textContent || '', margin + 5, yPosition, {
              fontSize: 8,
              color: [75, 85, 99],
              lineHeight: 4,
            })
            yPosition += skillsHeight + 4
          }

          addSpacing(4) // Add spacing between entries
        })
        
        const skillRows = section.querySelectorAll('.flex.gap-2')
        skillRows.forEach((row) => {
          checkPageBreak(5)
          const label = row.querySelector('.font-semibold')
          const value = row.querySelector('.text-sm')
          
          if (label && value) {
            addText((label.textContent || '') + ' ', margin, yPosition, {
              fontSize: 10,
              fontStyle: 'bold',
              color: [55, 65, 81],
            })
            addText(value.textContent || '', margin + 35, yPosition, {
              fontSize: 9,
              color: [31, 41, 55],
            })
            yPosition += 5
          }
        })
        
        yPosition += 3
      }
    })

    pdf.save(`${fileName}.pdf`)

  } catch (error) {
    console.error("PDF export error:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("canvas")) {
        throw new Error("PDF generation failed. This may be due to browser security restrictions. Try using a different browser or enabling popups for this site.")
      }

      if (error.message.includes("memory") || error.message.includes("size")) {
        throw new Error("PDF generation failed due to memory constraints. Try reducing the content size or using a smaller font size.")
      }
    }

    throw new Error("Failed to generate PDF. Please try again or contact support if the issue persists.")
  }
}