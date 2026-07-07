'use strict'

const assert = require('node:assert')

// Mock environment for content script loading
global.togglbutton = {
  render: () => {},
  createTimerLink: () => {}
}
global.$ = () => null
global.createTag = () => null
global.window = {
  location: {
    pathname: '/owner/repo/pull/1'
  }
}
global.document = {
  querySelector: () => null,
  createElement: () => ({ classList: { add: () => {} } })
}

const { getPaneDescription } = require('./github.js')

async function runTests() {
  console.log('Running tests...')

  // Test 1
  try {
    let callCount = 0
    const mockElem = {
      querySelector: (selector) => {
        callCount++
        if (callCount < 2) {
          return null
        }
        return {
          textContent: 'My Issue Title',
          parentElement: {
            lastChild: {
              textContent: '#123'
            }
          }
        }
      }
    }

    const desc = await getPaneDescription(mockElem)
    assert.strictEqual(desc, '#123 My Issue Title')
    assert.ok(callCount >= 2)
    console.log('✓ getPaneDescription waits for titleElem to be present and handles it')
  } catch (err) {
    console.error('✗ Test 1 failed:', err)
    process.exit(1)
  }

  // Test 2
  try {
    const mockElem = {
      querySelector: (selector) => {
        return {
          textContent: 'My Issue Title',
          parentElement: null
        }
      }
    }

    const desc = await getPaneDescription(mockElem)
    assert.strictEqual(desc, 'My Issue Title')
    console.log('✓ getPaneDescription handles missing parentElement or numElem')
  } catch (err) {
    console.error('✗ Test 2 failed:', err)
    process.exit(1)
  }

  console.log('All tests passed successfully.')
}

runTests()
