import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import ConfirmModal from '../../../src/components/common/ConfirmModal.vue'

// Configurar stubs globales para Teleport
config.global.stubs = {
  Teleport: true,
  Transition: false
}

describe('ConfirmModal.vue', () => {
  const defaultProps = {
    show: true,
    title: 'Confirmar acción',
    message: '¿Estás seguro de que deseas continuar?'
  }

  describe('Renderizado básico', () => {
    it('debería renderizar cuando show es true', () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('no debería mostrar contenido cuando show es false', () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          ...defaultProps,
          show: false
        }
      })

      // Con v-if y show=false, el contenido no debería existir
      expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    })
  })

  describe('Contenido del modal', () => {
    it('debería mostrar el título proporcionado', () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          ...defaultProps,
          title: 'Título personalizado'
        }
      })

      expect(wrapper.text()).toContain('Título personalizado')
    })

    it('debería mostrar el mensaje proporcionado', () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          ...defaultProps,
          message: 'Mensaje personalizado'
        }
      })

      expect(wrapper.text()).toContain('Mensaje personalizado')
    })
  })

  describe('Botones', () => {
    it('debería tener un botón de confirmar', () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps
      })

      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('debería mostrar texto personalizado en botón confirmar', () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          ...defaultProps,
          confirmText: 'Sí, eliminar'
        }
      })

      expect(wrapper.text()).toContain('Sí, eliminar')
    })

    it('debería mostrar texto personalizado en botón cancelar', () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          ...defaultProps,
          cancelText: 'No, volver'
        }
      })

      expect(wrapper.text()).toContain('No, volver')
    })

    it('debería emitir evento confirm al hacer clic en confirmar', async () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps
      })

      const buttons = wrapper.findAll('button')
      // El botón de confirmar suele estar primero en el orden flex-row-reverse
      const confirmButton = buttons.find(b => b.text().includes('Confirmar'))
      if (confirmButton) {
        await confirmButton.trigger('click')
        expect(wrapper.emitted('confirm')).toBeTruthy()
      }
    })

    it('debería emitir evento cancel al hacer clic en cancelar', async () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps
      })

      const buttons = wrapper.findAll('button')
      const cancelButton = buttons.find(b => b.text().includes('Cancelar'))
      if (cancelButton) {
        await cancelButton.trigger('click')
        expect(wrapper.emitted('cancel')).toBeTruthy()
      }
    })
  })

  describe('Tipos de modal', () => {
    const types = ['warning', 'danger', 'info', 'success']

    types.forEach(type => {
      it(`debería aceptar el tipo ${type}`, () => {
        const wrapper = mount(ConfirmModal, {
          props: {
            ...defaultProps,
            type
          }
        })

        expect(wrapper.exists()).toBe(true)
      })
    })
  })

  describe('Estado de carga', () => {
    it('debería mostrar spinner cuando loading es true', () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          ...defaultProps,
          loading: true
        }
      })

      expect(wrapper.find('.animate-spin').exists()).toBe(true)
    })

    it('no debería mostrar spinner cuando loading es false', () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          ...defaultProps,
          loading: false
        }
      })

      expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener role="dialog"', () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps
      })

      expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    })

    it('debería tener aria-modal="true"', () => {
      const wrapper = mount(ConfirmModal, {
        props: defaultProps
      })

      expect(wrapper.find('[aria-modal="true"]').exists()).toBe(true)
    })
  })
})
