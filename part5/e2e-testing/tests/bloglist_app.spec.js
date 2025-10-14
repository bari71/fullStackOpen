const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const headingLocator = page.getByRole('heading', { name: 'Login'})
        const buttonLocator = page.getByRole('button', { name: 'Login' })
        await expect(headingLocator).toBeVisible()
        await expect(buttonLocator).toBeVisible()
    })

    describe('Login', () => {
        beforeEach(async ({ page, request }) => {
            await request.post('http://localhost:5173/api/testing/reset')
            await request.post('http://localhost:5173/api/users', {
                data: {
                    name: 'Annur Bari',
                    username: 'bari71',
                    password: 'bari'
                }
            })
        })

        test('succeeds with correct credentials', async ({ page }) => {
            const textboxes = await page.getByRole('textbox').all()
            const loginButton = await page.getByRole('button', { name: 'Login' })
            await textboxes[0].fill('bari71')
            await textboxes[1].fill('bari')
            await loginButton.click()

            await expect(page.getByText('bari logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            const textboxes = await page.getByRole('textbox').all()
            const loginButton = await page.getByRole('button', { name: 'Login' })
            await textboxes[0].fill('bari')
            await textboxes[1].fill('wrong')
            await loginButton.click()

            await expect(page.getByText('invalid username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page, request }) => {
            await request.post('http://localhost:5173/api/testing/reset')
            await request.post('http://localhost:5173/api/users', {
                data: {
                    name: 'Annur Bari',
                    username: 'bari71',
                    password: 'bari'
                }
            })
            const textboxes = await page.getByRole('textbox').all()
            const loginButton = await page.getByRole('button', { name: 'Login'})
            await textboxes[0].fill('bari71')
            await textboxes[1].fill('bari')
            await loginButton.click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('new blog')
            await textboxes[1].fill('annur bari')
            await textboxes[2].fill('blah.com')
            await page.getByRole('button', { name: 'Create' }).click()

            await expect(page.getByText('a new blog new blog by annur bari')).toBeVisible()
            await expect(page.getByText('new blogview')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('new blog')
            await textboxes[1].fill('annur bari')
            await textboxes[2].fill('blah.com')
            await page.getByRole('button', { name: 'Create' }).click()

            await expect(page.getByText('a new blog new blog by annur bari')).toBeVisible()
            await expect(page.getByText('new blogview')).toBeVisible()

            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByText('likes 0')).toBeVisible()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('a blog can be deleted', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('new blog')
            await textboxes[1].fill('annur bari')
            await textboxes[2].fill('blah.com')
            await page.getByRole('button', { name: 'Create' }).click()

            await expect(page.getByText('a new blog new blog by annur bari')).toBeVisible()
            await expect(page.getByText('new blogview')).toBeVisible()
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'remove' }).click()
            await expect(page.getByText('new blogview')).not.toBeVisible()
        })

        test('only blog owners see the remove button', async ({ page, request }) => {{
            await page.getByRole('button', { name: 'create new blog' }).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('new blog')
            await textboxes[1].fill('annur bari')
            await textboxes[2].fill('blah.com')
            await page.getByRole('button', { name: 'Create' }).click()

            await expect(page.getByText('a new blog new blog by annur bari')).toBeVisible()

            await request.post('http://localhost:5173/api/users', {
                data: {
                    name: 'Annur Bari 2',
                    username: 'bari72',
                    password: 'bari'
                }
            })

            await page.getByRole('button', { name: 'logout' }).click()
            expect(page.getByRole('heading', { name: 'Login' }))

            const textboxes2 = await page.getByRole('textbox').all()
            await textboxes2[0].fill('bari72')
            await textboxes2[1].fill('bari')
            await page.getByRole('button', { name: 'Login' }).click()

            await expect(page.getByText('new blogview')).toBeVisible()

            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        }})

        test.only('', async ({ page, request }) => {
            await request.post('http://localhost:5173/api/testing/reset')
            await request.post('http://localhost:5173/api/users', {
            data: { name: 'Test User', username: 'testuser', password: 'testpass' }
            })

            // login via API to get token
            const loginRes = await request.post('http://localhost:5173/api/login', {
            data: { username: 'testuser', password: 'testpass' }
            })
            const loginJson = await loginRes.json()
            const token = loginJson.token

            const blogs = [
                { title: 'most likes', author: 'A', url: "blah.com", likes: 50 },
                { title: 'medium likes', author: 'B', url: "blah2.com", likes: 20 },
                { title: 'least likes', author: 'C', url: "blah3.com", likes: 5 }
            ]
            for (const b of blogs) {
                await request.post('http://localhost:5173/api/blogs', {
                    data: b,
                    headers: { Authorization: `Bearer ${token}` }
                })
            }
        })
    })
})