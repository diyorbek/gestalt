import { Fragment } from 'react';
import { Box, Flex, Heading, Link, List, Text } from 'gestalt';
import Card from '../../docs-components/Card';
import Markdown from '../../docs-components/Markdown';
import Page from '../../docs-components/Page';
import PageHeader from '../../docs-components/PageHeader';

function InlineLink({ children, href }: { children: string; href: string }) {
  return (
    <Fragment>
      {' '}
      <Link display="inlineBlock" href={href}>
        {children}
      </Link>{' '}
    </Fragment>
  );
}

export default function DocsPage() {
  return (
    <Page title="Frequently asked questions">
      <PageHeader name="Frequently asked questions" type="guidelines" />

      <Card name="Gestalt usage">
        <Flex alignItems="start" direction="column" gap={4}>
          <Heading size="400">What are the benefits of using the Gestalt library?</Heading>
          <Text>
            Using Gestalt guarantees adherence and compliance to Pinterest design standards and best
            practices which results in UI and UX consistency across surfaces.
          </Text>
          <List label="Gestalt also provides:">
            <List.Item text="Styled, tested, and accessible components" />
            <List.Item text="Right-to-left, internationalization, and dark-mode support" />
            <List.Item text="Low maintenance (automatic design and code updates cross-platform)" />
            <List.Item text="Well-documented components and continuous Gestalt team support" />
          </List>

          <Text>
            Gestalt increases designers and developers velocity with the highest design and code
            quality.
          </Text>
        </Flex>
      </Card>

      <Card name="Component usage">
        <Flex alignItems="start" direction="column" gap={4}>
          <Heading size="400">What is a boint?</Heading>
          <Text>
            A boint is a Pinterest specific unit of spacing that is equivalent to 4px. 1 boint =
            4px, 2 boints = 8px, etc.
          </Text>
          <Box>
            <Text>Gestalt component props such as margin and padding work with boint units.</Text>
            <Markdown
              text="
~~~bash
padding 0 .. 12
~~~"
            />
          </Box>

          <Heading size="400">How do I add Gestalt as a dependency?</Heading>
          <Text>
            Check out our
            <InlineLink href="/get_started/developers/installation">installation guide</InlineLink>
            for instructions. Note: we recommend using exact versions. ^1.37.0 is imprecise and
            could import v1.38.0, which could affect snapshots from version to version. Check
            <InlineLink href="https://devhints.io/semver">semver documentation</InlineLink>
            for hints on the differences.
          </Text>

          <Heading size="400">How do I import components from Gestalt?</Heading>
          <Text>
            Gestalt uses named exports — there is no default export. Simply import the components
            you need in your file:
            <Markdown
              text="
~~~jsx
import { Button, Text } from 'gestalt';
~~~"
            />
          </Text>

          <Heading size="400">How do I import Typescript types from Gestalt?</Heading>
          <Text>
            You don&apos;t! We do not explicitly export our Typescript types. We also recommend
            against manually copying type values into your codebase, as those are also subject to
            change and you will need to manually update your copied types.
          </Text>
          <Text>
            The recommended way of accessing Gestalt types (e.g. for a wrapper component) is to use
            React&apos;s type helper
            <InlineLink href="https://pdocs.pinadmin.com/docs/webapp/docs/typescript#component-prop-type">
              ComponentProps
            </InlineLink>
            to use the component&apos;s types directly:
          </Text>
          <Markdown
            text="
~~~jsx
import { ComponentProps } from 'react';

ComponentProps<typeof ComponentName>['propName']
~~~"
          />

          <Heading size="400">Does Gestalt have TypeScript support?</Heading>
          <Text>
            Yes. Gestalt officially supports and maintains TypeScript declaration files for our
            gestalt, gestalt-charts, and gestalt-datepicker packages.
          </Text>
          <Heading size="400">Does Gestalt have Flow support?</Heading>
          <Text inline>
            No. Gestalt officially stopped supporting and maintaining Flow files for our gestalt,
            gestalt-charts, and gestalt-datepicker packages after{' '}
            <Link display="inline" href="https://github.com/pinterest/gestalt/pull/3558">
              v147.6.0.
            </Link>
          </Text>
        </Flex>
      </Card>

      <Card name="Component development">
        <Flex alignItems="start" direction="column" gap={4}>
          <Heading size="400">How do I get access to the Gestalt repo?</Heading>
          <Text>
            The
            <InlineLink href="https://github.com/pinterest/gestalt">Gestalt repository</InlineLink>
            is public and you do not need special permissions to make pull requests.
          </Text>

          <Heading size="400">How do I easily generate files for a component?</Heading>
          <Text>
            Run the following and replace &quot;ComponentName&quot; with the name of your component.
            <Markdown
              text="
~~~jsx
yarn generate ComponentName
~~~"
            />
          </Text>

          <Heading size="400">
            What do we use for integration tests and how do we run the tests locally?
          </Heading>
          <Text>
            We use <InlineLink href="https://playwright.dev/">Playwright</InlineLink>
            for our integration tests. If you want to run the tests locally:
            <Markdown
              text={`
~~~bash
yarn playwright:test
~~~
          `}
            />
          </Text>
          <Heading size="400">How do I update a visual snapshot for a specific test?</Heading>
          <Text>
            Run <code>yarn playwright:test</code> and specify a visual test file:
          </Text>
          <Markdown
            text="
~~~bash
yarn playwright:test visual-test/Video.spec.ts --update-snapshots
~~~"
          />

          <Heading size="400">What is Gestalt teachings and how do I add a video?</Heading>
          <Heading size="400">Is there any internal Pinterest documentation for Gestalt?</Heading>
          <Text>
            If you&apos;re a Pinterest employee, you can visit
            <InlineLink href="http://pinch.pinadmin.com/gestalt_wiki">
              Pinterest&apos;s web platform documentation for Gestalt.
            </InlineLink>
          </Text>
        </Flex>
      </Card>
    </Page>
  );
}
