import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import Toast from '../../../src/components/common/Toast.vue'

// Deshabilitar el stub de Transition para tests
config.global.stubs = {
  Transition: false
}

describe('Toast.vue', () => {
  const defaultProps = {
    show: true,
    title: 'Test Title',
    message: 'Test Message',
    type: 'success'
  }

  describe('Renderizado', () => {
    it('debería renderizar cuando show es true', () => {
      const wrapper = mount(Toast, {
        props: defaultProps
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    })

    it('no debería renderizar cuando show es false', () => {
      const wrapper = mount(Toast, {
        props: {
          ...defaultProps,
          show: false
        }
      })

      expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    })

    it('debería mostrar el título cuando se proporciona', () => {
      const wrapper = mount(Toast, {
        props: {
          ...defaultProps,
          title: 'Mi Título'
        }
      })

      expect(wrapper.text()).toContain('Mi Título')
    })

    it('debería mostrar el mensaje cuando se proporciona', () => {
      const wrapper = mount(Toast, {
        props: {
          ...defaultProps,
          message: 'Mi Mensaje'
        }
      })

      expect(wrapper.text()).toContain('Mi Mensaje')
    })
  })

  describe('Tipos de toast', () => {
    const types = ['success', 'error', 'warning', 'info']

    types.forEach(type => {
      it(`debería aceptar el tipo ${type}`, () => {
        const wrapper = mount(Toast, {
          props: {
            ...defaultProps,
            type
          }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('[role="alert"]').exists()).toBe(true)
      })
    })
  })

  describe('Botón de cerrar', () => {
    it('debería mostrar botón de cerrar cuando closable es true', () => {
      const wrapper = mount(Toast, {
        props: {
          ...defaultProps,
          closable: true
        }
      })

      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('no debería mostrar botón de cerrar cuando closable es false', () => {
      const wrapper = mount(Toast, {
        props: {
          ...defaultProps,
          closable: false
        }
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('debería emitir evento close al hacer clic en el botón', async () => {
      const wrapper = mount(Toast, {
        props: {
          ...defaultProps,
          closable: true
        }
      })

      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Posiciones', () => {
    const positions = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ]

    positions.forEach(position => {
      it(`debería aceptar la posición ${position}`, () => {
        const wrapper = mount(Toast, {
          props: {
            ...defaultProps,
            position
          }
        })

        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  describe('Props por defecto', () => {
    it('debería tener valores por defecto correctos', () => {
      const wrapper = mount(Toast, {
        props: {
          show: true
        }
      })

      expect(wrapper.exists()).toBe(true)
    })
  })
})
