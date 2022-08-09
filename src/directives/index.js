export const imgError = {
  inserted(el, optionns) {
    // console.log(el)
    el.onerror = function() {
      // console.log('error')
      el.src = optionns.value
    }
  }
}

export const focus = {
  inserted: function(el) {
    el.focus()
  }
}
