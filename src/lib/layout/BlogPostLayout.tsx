/* eslint-disable import/no-duplicates */

'use client';

import {
  Heading,
  Flex,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  BreadcrumbLink,
  Breadcrumb,
  BreadcrumbItem,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import type { IPosts } from '../types/custom-types';

const Container = dynamic(() => import('~/lib/components/Container'));
const BlogPost = dynamic(() => import('~/lib/layout/BlogPost'));

export default function BlogPostLayout({ posts }: { posts: IPosts[] }) {
  const [searchValue, setSearchValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  const filteredBlogPosts = posts
    .sort((a: IPosts, b: IPosts) =>
      a.publishedAt && b.publishedAt
        ? Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
        : 0
    )
    .filter(
      (post: IPosts) =>
        post?.title?.toLowerCase().includes(searchValue.toLowerCase())
    );

  if (!isClient) {
    return <div>Loading..</div>;
  }

  return (
    <Container>
      <Flex
        as="main"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        m="0 auto 4rem auto"
        maxWidth="auto"
      >
        <Stack
          spacing={8}
          justifyContent="center"
          alignItems="flex-start"
          maxWidth="auto"
        >
          <Flex
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            maxWidth="auto"
            height="100%"
            px={4}
          >
            <Heading letterSpacing="tight" mb={4} as="h1" size="xl">
              Blog ({filteredBlogPosts.length} posts)
            </Heading>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Blog</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <InputGroup mb={4} mr={4} w="100%">
              <Input
                aria-label="Search by title"
                placeholder="Search by title"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <InputRightElement>
                {/* <SearchIcon color="gray.300" /> */}
              </InputRightElement>
            </InputGroup>
            {!filteredBlogPosts.length && 'No posts found :('}
            {filteredBlogPosts.map((post: IPosts) => (
              <BlogPost key={post.title || ''} {...post} />
            ))}
          </Flex>
        </Stack>
      </Flex>
    </Container>
  );
}
