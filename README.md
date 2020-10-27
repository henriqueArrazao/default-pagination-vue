# default-pagination-vue

<img src="https://github.com/henriqueArrazao/default-pagination-vue/blob/master/imgsReadme/mainGif.gif?raw=true" width="400" />

## Installation

Install the package

```
$ npm install default-pagination-vue
```

Register the component globally in the main.js

```js
import DefaultPagination from 'default-pagination-vue';
Vue.component('default-pagination', DefaultPagination);
```

or inside a component

```js
import DefaultPagination from 'default-pagination-vue';
export default {
  components: {
    DefaultPagination
  }
};
```

## Simple example

```html
<default-pagination
  v-model="current"
  :total-pages="20"
  :max-squares="10"
  no-first-last-icon
  not-inherit-font
  @page-click="handleClick"
/>
```

```js
    handleClick({ newPage, totalPages, blurState, cancelChange, done }){}
```

## Props (every Boolean prop is false by default)

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type      | Description                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `total-pages`                                                                                                                                                                                                                                  | `Number`  | **1 by default**                                                                                                            |
| `v-model`                                                                                                                                                                                                                                      | `Number`  | Will set/get the current page. **1 by default**                                                                             |
| `max-squares`                                                                                                                                                                                                                                  | `Number`  | Number of squares (all pages including the '...' buttons). **7 by default**                                                 |
| `no-first-last-icon`                                                                                                                                                                                                                           | `Boolean` | Removes the icon from 'first' and 'last' button                                                                             |
| `no-first-last-text`                                                                                                                                                                                                                           | `Boolean` | Removes the text from 'first' and 'last' button                                                                             |
| `no-first-last`                                                                                                                                                                                                                                | `Boolean` | Removes 'first' and 'last' button                                                                                           |
| `text-first`                                                                                                                                                                                                                                   | `String`  | Text for the 'first' button **'First' by default**                                                                          |
| `text-last`                                                                                                                                                                                                                                    | `String`  | Text for the 'last' button **'Last' by default**                                                                            |
| `no-prev-next`                                                                                                                                                                                                                                 | `Boolean` | Removes 'previous' and 'next' button                                                                                        |
| **`mode-simple`**                                                                                                                                                                                                                              | `Boolean` | pagination without any '...'                                                                                                |
| **`mode-default`**                                                                                                                                                                                                                             | `Boolean` | pagination with '...' before and after the pages when it is necessary                                                       |
| **`mode-fancy`**                                                                                                                                                                                                                               | `Boolean` | pagination with '...' after at the first square and the first page always visible (same for the last), when it is necessary |
| `primary-color`                                                                                                                                                                                                                                | `String`  | CSS color (text color mainly) **#4c4c4c by default**                                                                        |
| `secondary-color`                                                                                                                                                                                                                              | `String`  | CSS color (background page buttons mainly) **white by default**                                                             |
| `shadow-color`                                                                                                                                                                                                                                 | `String`  | CSS color **#565656 by default**                                                                                            |
| `disabled-color`                                                                                                                                                                                                                               | `String`  | CSS color (text color of controller buttons when there is no previous or next page) **#808080ad by default**                |
| `colored-controllers`                                                                                                                                                                                                                          | `Boolean` | Controllers (first/prev/next/last) with the same color of font (primary-color) when they are enable                         |
| `not-inherit-font`                                                                                                                                                                                                                             | `Boolean` | Will not inherit the font-family from your project, but the same as the examples 'Commissioner' font-family                 |

## 'page-click' event

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type       | Description                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `newPage`                                                                                                                                                                                                                                      | `Number`   | Current page                                                                                                                                                      |
| `totalPages`                                                                                                                                                                                                                                   | `Number`   | Total pages                                                                                                                                                       |
| `cancelChange`                                                                                                                                                                                                                                 | `Function` | In case an error happens during the http request for example, it will return to the previous page, recommended use inside '.catch'                                |
| `blurState`                                                                                                                                                                                                                                    | `Function` | use it whenever you use 'cancelChange' in your code, it will blur the component and prevent the user click, the 'cancelChange' or 'done' can deblur the component |
| `done`                                                                                                                                                                                                                                         | `Function` | will release the component, you can call inside the '.then' for example                                                                                           |

#### Example

<img src="https://github.com/henriqueArrazao/default-pagination-vue/blob/master/imgsReadme/cancelChange.gif?raw=true" width="450" />

```js
    handleClick({ newPage, totalPages, blurState, cancelChange, done }) {
      console.log(newPage, totalPages, blurState, cancelChange, done);
      blurState();
      setTimeout(() => cancelChange(), 500);
    }
```

```js
    handleClick({ blurState, cancelChange, done }) {
      blurState();
      yourRequest().then(()=>{
        //your code here
        done();
      })
      .catch(err =>
        cancelChange();
        alert(err);
      )
    }
```

## Slots (replace content)

| Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `first`                                                                                                                                                                                                                                        | Content inside 'first button'    |
| `last`                                                                                                                                                                                                                                         | Content inside 'last button'     |
| `previous`                                                                                                                                                                                                                                     | Content inside 'previous button' |
| `next`                                                                                                                                                                                                                                         | Content inside 'next button'     |

#### Example

```html
<default-pagination v-model="current" :total-pages="10">
  <template #first> First one page </template>
  <template #last> Last one page <my-component /> </template>
  <template #previous> <my-own-icon /> </template>
</default-pagination>
```
