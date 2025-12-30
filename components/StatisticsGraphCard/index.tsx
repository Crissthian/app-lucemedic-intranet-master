'use client'
import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './statistics-graph-card.module.css'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

interface StatisticsGraphCardProps {
  children: React.ReactNode;
  title?: string;
}

const StatisticsGraphCard: React.FC<StatisticsGraphCardProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const downloadButtonRef = useRef<HTMLDivElement>(null)

  const downloadImageFromDiv = () => {
    if (containerRef.current) {
      if (downloadButtonRef.current) {
        downloadButtonRef.current.style.display = 'none'
      }

      // insert h2 on containerRef from props.title
      if (props.title) {
        const title = document.createElement('h2')
        title.innerText = props.title
        containerRef.current.insertBefore(title, containerRef.current.firstChild)
      }

      const options = {
        backgroundColor: '#FFFFFF',
      }

      const chartOptions = {
        fontFamily: 'Arial', // Cambia la fuente a Arial
        fontSize: 12, // Tamaño de fuente personalizado
        fontWeight: 'bold', // Peso de la fuente
      }
  
      // Aplica las opciones a las etiquetas del gráfico
      const chartLabels = document.querySelectorAll('.recharts-text')
  
      chartLabels.forEach((label) => {
        label.setAttribute('font-family', chartOptions.fontFamily)
        label.setAttribute('font-size', `${chartOptions.fontSize}`)
        label.setAttribute('font-weight', chartOptions.fontWeight)
      })

      const chartOptions2 = {
        fontFamily: 'Arial', // Cambia la fuente a Arial
        fontSize: 11, // Tamaño de fuente personalizado
        fontWeight: 'normal', // Peso de la fuente
      }

      const chartLayers = document.querySelectorAll('.recharts-layer')
  
      chartLayers.forEach((label) => {
        label.setAttribute('font-family', chartOptions2.fontFamily)
        label.setAttribute('font-size', `${chartOptions2.fontSize}`)
        label.setAttribute('font-weight', chartOptions2.fontWeight)
      })

      html2canvas(containerRef.current, options).then((canvas: any) => {
        canvas.webkitImageSmoothingEnabled = true
        canvas.mozImageSmoothingEnabled = true
        canvas.imageSmoothingEnabled = true

        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = 'graph.png'
        link.click()
      })

      if (downloadButtonRef.current) {
        downloadButtonRef.current.style.display = 'block'
      }
      if (props.title && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={downloadButtonRef} className={styles.downloadButton} onClick={downloadImageFromDiv}>
        <FontAwesomeIcon icon={faDownload} width={16} height={17} color={'#1980EE'} />
      </div>
      {props.children}
    </div>
  )
}

export default StatisticsGraphCard