import { expect, test, type Locator, type Page } from '@playwright/test'

async function dragWithPointer(
  page: Page,
  source: Locator,
  target: Locator,
) {
  const sourceBox = await source.boundingBox()
  const targetBox = await target.boundingBox()
  if (!sourceBox || !targetBox) throw new Error('Drag elements are not visible.')

  const start = {
    x: sourceBox.x + sourceBox.width / 2,
    y: sourceBox.y + sourceBox.height / 2,
  }
  const end = {
    x: targetBox.x + targetBox.width / 2,
    y: targetBox.y + targetBox.height / 2,
  }

  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(end.x, end.y, { steps: 12 })
  await page.mouse.up()
}

test.beforeEach(async ({ page }) => {
  await page.route('https://rickandmortyapi.com/graphql', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          characters: {
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
          },
        },
      }),
    })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Reset board' }).click()
})

test('moves a card into Done, shows the portal, and persists the move', async ({
  page,
}) => {
  const doing = page.getByRole('region', { name: 'Doing' })
  const done = page.getByRole('region', { name: 'Done' })

  await dragWithPointer(
    page,
    doing.getByRole('button', { name: 'Move Upgrade garage security' }),
    done.locator('.kanban-card').first(),
  )

  await expect(
    done.getByRole('heading', { name: 'Upgrade garage security' }),
  ).toBeVisible()
  await expect(doing.getByLabel('0 items')).toBeVisible()
  await expect(done.getByLabel('2 items')).toBeVisible()
  await expect(page.locator('.portal-effect')).toBeVisible()

  await page.reload()
  await expect(
    page
      .getByRole('region', { name: 'Done' })
      .getByRole('heading', { name: 'Upgrade garage security' }),
  ).toBeVisible()
})

test('reorders cards within a column without showing the portal', async ({
  page,
}) => {
  const todo = page.getByRole('region', { name: 'To Do' })

  await dragWithPointer(
    page,
    todo.getByRole('button', { name: 'Move Collect Mega Seeds' }),
    todo.locator('.kanban-card').first(),
  )

  await expect(todo.getByRole('heading', { level: 3 })).toHaveText([
    'Collect Mega Seeds',
    'Calibrate the portal gun',
  ])
  await expect(page.locator('.portal-effect')).toHaveCount(0)
})
