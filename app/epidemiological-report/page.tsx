'use client'
import styles from './epidemiological-report.module.css'
import Panel from '@/components/Panel'
import TableEpidemiological from '@/components/TableEpidemiological'

export default function EpidemiologicalReport() {
  return (
    <Panel>
      <div className={styles.container}>
        <p>
          Encuentra aquí los informes epidemiológicos realizados por nuestra
          área de medicina <br /> ocupacional para tu empresa.
        </p>
        <TableEpidemiological />
      </div>
    </Panel>
  )
}
