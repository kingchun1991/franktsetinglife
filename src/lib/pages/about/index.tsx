'use client';

import { Flex, HStack, Avatar, Text, Box } from '@chakra-ui/react';

import companyInfo from '../../../../content/companyInfo.json';
import workexp from '../../../../content/workexp.json';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '@/components/ui/accordion';
import Timeline from '@/lib/components/Timeline';
import type {
  ICompanyInfo,
  IWorkexp,
  IWorkexpHeader,
} from '@/lib/types/custom-types';

function joinData(
  workexp1: IWorkexp[],
  companyInfo2: ICompanyInfo[]
): IWorkexp[] {
  return workexp1.map((we) => {
    const ci = companyInfo2.find((ci2) => ci2.companyKey === we.companyKey);
    if (ci) {
      return {
        ...we,
        companyName: ci.companyName,
        companyIcon: ci.companyIcon,
      };
    }
    return we;
  });
}

function groupAndGetLatestDates(data: IWorkexp[]): IWorkexp[] {
  return data.reduce((acc, curr) => {
    const existingItem = acc.find(
      (item) => item.companyKey === curr.companyKey
    );
    if (existingItem) {
      if (curr.to !== 'Current') {
        const currDate = new Date(curr.to);
        const existingDate = new Date(existingItem.to);
        if (currDate > existingDate) {
          existingItem.from = curr.from;
          existingItem.to = curr.to;
        }
      }
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as IWorkexp[]);
}

const About = () => {
  const companyInfoData = companyInfo as ICompanyInfo[];
  const workexpData = workexp as IWorkexp[];

  const joinedData = joinData(workexpData, companyInfoData);
  const groupedData = groupAndGetLatestDates(joinedData);
  const finalData = groupedData.map(
    ({ title, ...rest }) => rest
  ) as IWorkexpHeader[];

  return (
    <Flex
      direction="column"
      alignItems="left"
      justifyContent="center"
      minHeight="70vh"
      gap={4}
      mb={8}
      w="full"
    >
      <Text fontSize="2xl" as="b">
        Working Experience
      </Text>
      <AccordionRoot multiple defaultValue={['HA']}>
        {finalData.map((item) => {
          // Filter workexpData by item.companyKey
          const workexpDataForItem = workexpData.filter(
            (we) => we.companyKey === item.companyKey
          );

          return (
            <AccordionItem key={item.companyKey} value={item.companyKey}>
              <h2>
                <AccordionItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    <Flex mb={1}>
                      <HStack>
                        <Avatar.Root size="sm">
                          <Avatar.Image
                            src={
                              item.companyIcon
                                ? item.companyIcon
                                : 'default_icon_url'
                            }
                          />
                          <Avatar.Fallback />
                        </Avatar.Root>
                        <Text fontSize="md">{item.companyName}</Text>
                      </HStack>
                    </Flex>
                    <Flex mb={1}>
                      <Text fontSize="md" as="b">
                        {item.from} - {item.to}
                      </Text>
                    </Flex>
                  </Box>
                </AccordionItemTrigger>
              </h2>
              <AccordionItemContent pb={4}>
                <Timeline workexps={workexpDataForItem} />
              </AccordionItemContent>
            </AccordionItem>
          );
        })}
      </AccordionRoot>
    </Flex>
  );
};

export default About;
