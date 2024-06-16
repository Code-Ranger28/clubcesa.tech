'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import ResourceCard from './_components/resource_card';
import { ResourceObject, Tags } from './_components/data';
import { convertTags } from '@/lib/convert-tags';

type ResourceObject = {
  title: string;
  description: string;
  link: string;
  tags: string[];
};

export default function Dashboard() {
  const [allResources, setAllResources] = React.useState<
    ResourceObject[] | null
  >(null);
  const [filteredResources, setFilteredResources] = React.useState<
    ResourceObject[] | null
  >(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<string>('all');

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // get resources from the firebase
    setAllResources(ResourceObject);
    setFilteredResources(ResourceObject);

    const tagsLabel = convertTags(Tags)
      .map((tag) => tag.label)
      .sort((a, b) => a.localeCompare(b));

    setTags(tagsLabel);
  }, []);

  const onSearchSubmit = (formData: FormData) => {
    const serachQuery = formData.get('search-query') as string;
    if (serachQuery === null) return;

    if (serachQuery.length < 3) {
      setSearchError('Search query must be at least 3 characters long');
      return;
    }

    setSearchError(null);

    const query = serachQuery.toString().toLowerCase();

    if (allResources == null) {
      setSearchError('No resources found');
      return;
    }

    const searchedResources = allResources.filter((res) => {
      const lowerCaseTags = res.tags.map((tag) => tag.toLowerCase());

      return (
        (res.title.toLowerCase().includes(query) ||
          lowerCaseTags.includes(query) ||
          lowerCaseTags.some((tag) => tag.includes(query))) &&
        (lowerCaseTags.includes(selectedTag) || selectedTag === 'all')
      );
    });

    if (searchedResources.length === 0) {
      setSearchError('No resources found');
      return;
    }

    setFilteredResources(searchedResources);
  };

  const onTagChange = (tag: string) => {
    setSearchError(null);
    inputRef.current!.value = '';

    if (tag === 'All') {
      setFilteredResources(allResources);
      setSelectedTag('all');
      return;
    }

    if (allResources == null) {
      setSearchError('No resources found');
      return;
    }

    setSelectedTag(tag.toLowerCase());

    setFilteredResources(
      allResources!.filter((res) => {
        return res.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase());
      }),
    );
  };

  function getSixDigitNumber() {
    return (Math.floor(Math.random() * 900000) + 100000).toString();
  }

  return (
    <div className='container mt-4 min-h-screen'>
      <div className='my-2 flex flex-row gap-4'>
        <Select onValueChange={onTagChange}>
          <SelectTrigger className='flex-1'>
            <SelectValue placeholder='Select tag' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={'all' + getSixDigitNumber()} value='All'>
                All
              </SelectItem>

              {tags.map((tag) => {
                return (
                  <SelectItem
                    key={tag.toLowerCase() + getSixDigitNumber()}
                    value={tag}
                  >
                    {tag}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className='flex flex-1 flex-col gap-1'>
          <form action={onSearchSubmit} className='flex flex-row gap-4'>
            <Input
              type='search'
              name='search-query'
              placeholder='Search resource'
              ref={inputRef}
              autoComplete='off'
            />
            <Button type='submit' className='bg-cesa-blue'>
              Search
            </Button>
          </form>
          {searchError ? (
            <span className='text-sm text-destructive'>{searchError}</span>
          ) : null}
        </div>
      </div>

      <div className='mx-4 my-6'>
        {filteredResources == null ? (
          <p className='text-center text-lg font-semibold text-destructive'>
            No resources found
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredResources.map((res, i) => {
              return (
                <ResourceCard
                  key={i + getSixDigitNumber()}
                  title={res.title}
                  description={res.description}
                  link={res.link}
                  tags={res.tags}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
