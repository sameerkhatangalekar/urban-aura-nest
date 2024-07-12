import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);

/*
 *  Sets meta data to be used by Gaurds to identify if route is public or not
 */
