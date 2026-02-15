'use client'
import 'moment/locale/es'
import moment from 'moment-timezone'
import { Roboto, Rubik } from 'next/font/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAddressCard,
  faAssistiveListeningSystems,
  faCheckCircle,
  faChevronLeft,
  faCircleNotch,
  faClock,
  faEye,
  faFileMedicalAlt,
  faFlask,
  faHeadSideCough,
  faHeart,
  faHospitalUser,
  faLungs,
  faSignOutAlt,
  faStethoscope,
  faTimesCircle,
  faTooth,
  faXRay
} from '@fortawesome/free-solid-svg-icons'
import styles from './table-tracking.module.css'
import { AttentionMonitoring } from '@/models/attention-monitoring'
import { useState } from 'react'

moment().tz('America/Lima').format()

const rubik400 = Rubik({ weight: '400', subsets: ['latin'] })
const rubik500 = Rubik({ weight: '500', subsets: ['latin'] })
const roboto400 = Roboto({ weight: '400', subsets: ['latin'] })

interface ITableTrackingProps {
  data: AttentionMonitoring[]
}

const TableTracking: React.FC<ITableTrackingProps> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentAttention, setCurrentAttention] = useState<AttentionMonitoring>(
    {
      fec_fmed: '',
      num_dni: '',
      cdg_fmed: '',
      nombres: '',
      h_ing: '',
      h_sal: '',
      md: '',
      oft: '',
      ot: '',
      rx: '',
      lb: '',
      od: '',
      ca: '',
      es: '',
      ps: '',
      tr: '',
      obs_des: '',
      cdg_lug: ''
    }
  )

  const showDetail = (item: AttentionMonitoring) => {
    setShowModal(true)
    setCurrentAttention(item)
  }

  return (
    <>
      {showModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modalWrapper}>
            <p className={styles.btnBack} onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faChevronLeft} width={12} height={19} />{' '}
              <span>Volver</span>
            </p>
            <h3 className={`${rubik500.className} ${styles.modalTitle}`}>
              {currentAttention.nombres}
            </h3>
            <div className={styles.modalTable}>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faStethoscope} width={10} height={19} />{' '}
                Triaje
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faFlask} width={10} height={19} /> Lab.
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faStethoscope} width={10} height={19} />{' '}
                Med.
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faXRay} width={10} height={19} /> RX
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faTooth} width={10} height={19} />{' '}
                Odonto.
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faEye} width={10} height={19} /> Oftalmo.
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon
                  icon={faAssistiveListeningSystems}
                  width={10}
                  height={19}
                />{' '}
                Audiom.
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faLungs} width={10} height={19} />{' '}
                Espirom.
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon
                  icon={faHeadSideCough}
                  width={10}
                  height={19}
                />{' '}
                Psico.
              </div>
              <div className={styles.modalTableHeaderItem}>
                <FontAwesomeIcon icon={faHeart} width={10} height={19} />{' '}
                Cardio.
              </div>
            </div>
            <div className={styles.modalTableBody}>
              {/* <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} /> */}
              <div className={styles.modalTableBodyItem}>
                {currentAttention.tr === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.tr === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.lb === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.lb === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.md === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.md === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.rx === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.rx === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.od === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.od === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.oft === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.oft === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.ot === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.ot === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.es === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.es === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.ps === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.ps === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
              <div className={styles.modalTableBodyItem}>
                {currentAttention.ca === 'X' ? (
                  <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />
                ) : currentAttention.ca === 'NOPASA' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />
                ) : (
                  <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <p className={rubik500.className}>
                <FontAwesomeIcon icon={faCheckCircle} color={'#1EE67D'} />{' '}
                <span>Atendido</span>
              </p>
              <p className={rubik500.className}>
                <FontAwesomeIcon icon={faCircleNotch} color={'#6665DD'} />{' '}
                <span>Pendiente</span>
              </p>
              <p className={rubik500.className}>
                <FontAwesomeIcon icon={faTimesCircle} color={'#636D73'} />{' '}
                <span>No aplica atención</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {props.data.length > 0 ? (
        <div className={styles.table}>
          <div className={styles.header}>
            <div className={rubik400.className}>
              <span>
                <FontAwesomeIcon icon={faAddressCard} />
              </span>{' '}
              DATOS
            </div>
            <div className={rubik400.className}>
              <span>
                <FontAwesomeIcon icon={faClock} />
              </span>{' '}
              Hora de Ingreso
            </div>
            <div className={rubik400.className}>
              <span>
                <FontAwesomeIcon icon={faHospitalUser} />
              </span>{' '}
              Proceso de atención
            </div>
            <div className={rubik400.className}>
              <span>
                <FontAwesomeIcon icon={faClock} />
              </span>{' '}
              Hora de salida
            </div>
          </div>
          <div className={styles.body}>
            {props.data.map((item, index) => {
              return (
                <>
                  <div key={index} className={styles.row}>
                    <div>
                      <p
                        className={`${roboto400.className} ${styles.fullName}`}
                      >
                        {item.nombres || ''}
                      </p>
                      <p className={`${rubik400.className} ${styles.subLabel}`}>
                        Fecha de atención:{' '}
                        {moment(item.fec_fmed.split('T')[0]).format('LL') || ''}
                      </p>
                      <p className={`${rubik400.className} ${styles.subLabel}`}>
                        DNI: {item.num_dni || ''}
                      </p>
                    </div>
                    <div>{item.h_ing || '--:--'}</div>
                    <div className={styles.careProcessContainer}>
                      <div className={styles.step}>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          color={'#1EE67D'}
                        />
                        <p className={styles.stepTitle}>Ingreso</p>
                        <p className={styles.stepStatus}>
                          <span>Completado</span>
                        </p>
                      </div>
                      {item.h_sal === '' && (
                        <>
                          <div className={styles.step}>
                            <FontAwesomeIcon
                              icon={faFileMedicalAlt}
                              color={'#636D73'}
                            />
                            <p className={styles.stepTitle}>Evaluación</p>
                            <p className={styles.stepStatusPendingProgress}>
                              <span>En proceso</span>
                            </p>
                            <div
                              className={styles.viewMore}
                              onClick={() => showDetail(item)}
                            >
                              Ver detalle
                            </div>
                          </div>
                          <div className={styles.step}>
                            <FontAwesomeIcon
                              icon={faSignOutAlt}
                              color={'#636D73'}
                            />
                            <p className={styles.stepTitle}>Salida</p>
                            <p className={styles.stepStatusPending}>
                              <span>Pendiente</span>
                            </p>
                          </div>
                        </>
                      )}
                      {item.h_sal !== '' && (
                        <>
                          <div className={styles.step}>
                            <FontAwesomeIcon
                              icon={faFileMedicalAlt}
                              color={'#1EE67D'}
                            />
                            <p className={styles.stepTitle}>Evaluación</p>
                            <p className={styles.stepStatus}>
                              <span>Completado</span>
                            </p>
                            <div
                              className={styles.viewMore}
                              onClick={() => showDetail(item)}
                            >
                              Ver detalle
                            </div>
                          </div>
                          <div className={styles.step}>
                            <FontAwesomeIcon
                              icon={faSignOutAlt}
                              color={'#1EE67D'}
                            />
                            <p className={styles.stepTitle}>Salida</p>
                            <p className={styles.stepStatus}>
                              <span>Completado</span>
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    {/* <CareProcess attentionMonitoring={item}  currentStep={item.h_sal === '' ? 1 : 3} /> */}
                    <div>{item.h_sal || '--:--'}</div>
                  </div>
                </>
              )
            })}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default TableTracking
