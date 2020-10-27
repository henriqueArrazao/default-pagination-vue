import { mount, shallowMount } from '@vue/test-utils';
import Pagination from '@/DefaultPagination.vue';

describe('Pagination Component', () => {
  describe('PAGE-CLICK EVENT', () => {
    test('should not trigger when clicked to go to the same page', () => {
      const wrapper = shallowMount(Pagination, {
        propsData: { totalPages: 5 }
      });

      const btnsToNotTrigger = ['first', 'previous'];
      wrapper.findAll('li').forEach(async btn => {
        if (
          btnsToNotTrigger.includes(btn.attributes().id) ||
          btn.text() === '...'
        )
          await btn.trigger('click');
      });

      expect(wrapper.emitted('page-click')).toBeFalsy();
    });
    test('cancelling correctly when called the parameter function "cancelChange"', async () => {
      const parent = mount({
        template:
          '<default-pagination :total-pages="5" v-model="current"></default-pagination>',
        data() {
          return { current: 3 };
        },
        components: {
          'default-pagination': Pagination
        }
      });

      const wrapper = parent.findComponent(Pagination);

      const page2btn = wrapper.findAll('li').find(a => a.text() === '2');
      await page2btn.trigger('click');

      expect(wrapper.vm.modelValue).toBe(2);

      const event = wrapper.emitted('page-click')[0][0];
      await event.cancelChange();

      expect(wrapper.vm.modelValue).toBe(3);
    });
  });
  describe('PROPS (to remove elements)', () => {
    describe('Buttons: first & last', () => {
      test('no-first-last', () => {
        let wrapper = shallowMount(Pagination, {
          propsData: { noFirstLast: true }
        });
        let first = wrapper.find('#first');
        let last = wrapper.find('#last');
        expect(first.exists() || last.exists()).toBeFalsy();

        wrapper = shallowMount(Pagination);
        first = wrapper.find('#first');
        last = wrapper.find('#last');
        expect(first.exists() && last.exists()).toBeTruthy();
      });
      test('no-first-last-icon', () => {
        let wrapper = shallowMount(Pagination, {
          propsData: { noFirstLastIcon: true }
        });
        expect(wrapper.findAll('.last-icons')).toHaveLength(0);

        wrapper = shallowMount(Pagination);
        expect(wrapper.findAll('.last-icons')).toHaveLength(2);
      });
      test('no-first-last-text', () => {
        let wrapper = shallowMount(Pagination, {
          propsData: { noFirstLastText: true }
        });
        let first = wrapper.find('#first');
        let last = wrapper.find('#last');
        expect(first.text() || last.text()).toBeFalsy();

        wrapper = shallowMount(Pagination);
        first = wrapper.find('#first');
        last = wrapper.find('#last');
        expect(first.text() && last.text()).toBeTruthy();
      });
      test('text-first', () => {
        const wrapper = shallowMount(Pagination, {
          propsData: { textFirst: 'first one' }
        });
        expect(wrapper.find('#first').text()).toEqual('first one');
      });
      test('text-last', () => {
        const wrapper = shallowMount(Pagination, {
          propsData: { textLast: 'last one' }
        });
        expect(wrapper.find('#last').text()).toEqual('last one');
      });
    });
    describe('Buttons: previous & next', () => {
      test('no-prev-text', () => {
        let wrapper = shallowMount(Pagination, {
          propsData: { noPrevNext: true }
        });
        let previous = wrapper.find('#previous');
        let next = wrapper.find('#next');
        expect(previous.exists() || next.exists()).toBeFalsy();

        wrapper = shallowMount(Pagination);
        previous = wrapper.find('#previous');
        next = wrapper.find('#next');
        expect(previous.exists() && next.exists()).toBeTruthy();
      });
    });
    describe('Colors & Font', () => {
      test('- - -', () => {
        //not able to test the css attributes in the DOM
      });
    }),
      describe('Pagination mode', () => {
        test('mode-simple', () => {
          const wrapper = shallowMount(Pagination, {
            propsData: { modeSimple: true, modelValue: 5, totalPages: 10 }
          });

          const squares = wrapper.findAll('#square');
          expect(squares.length).toBe(7);

          expect(squares.every(s => s.text() !== '...')).toBeTruthy();
        });
        test('mode-default', () => {
          const wrapper = shallowMount(Pagination, {
            propsData: { modelValue: 5, totalPages: 10 }
          });

          const squares = wrapper.findAll('#square');

          const isFirstDot = squares.shift().text() === '...';
          const isLastDot = squares.pop().text() === '...';
          expect(isFirstDot && isLastDot).toBeTruthy();

          expect(squares.every(s => s.text() !== '...')).toBeTruthy();
        });
        test('mode-fancy', () => {
          const wrapper = shallowMount(Pagination, {
            propsData: { modeFancy: true, modelValue: 5, totalPages: 10 }
          });

          const squares = wrapper.findAll('#square');
          expect(
            squares[1].text() === '...' &&
              squares[squares.length - 2].text() === '...'
          ).toBeTruthy();

          expect(
            squares.every((s, index) =>
              [1, squares.length - 2].includes(index)
                ? s.text() === '...'
                : s.text() !== '...'
            )
          ).toBeTruthy();
        });
      });
  });
  describe('V-SLOTS', () => {
    describe('Buttons: first & last', () => {
      const wrapper = mount(Pagination, {
        slots: {
          first: '<h3>first one</h3>',
          last: '<h3>last one</h3>'
        }
      });
      test('first', () => {
        expect(wrapper.html()).toContain('<h3>first one</h3>');
      }),
        test('last', () => {
          expect(wrapper.html()).toContain('<h3>last one</h3>');
        });
    });
    describe('Buttons: previous & next', () => {
      const wrapper = mount(Pagination, {
        slots: {
          previous: '<h2> one back </h2>',
          next: '<h2> one next </h2>'
        }
      });
      test('previous', () => {
        expect(wrapper.html()).toContain('<h2> one back </h2>');
      }),
        test('next', () => {
          expect(wrapper.html()).toContain('<h2> one next </h2>');
        });
    });
  });
});
