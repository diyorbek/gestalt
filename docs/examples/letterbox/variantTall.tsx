import { Flex, Image, Letterbox } from 'gestalt';

export default function Example() {
  return (
    <Flex alignItems="center" height="100%" justifyContent="center" width="100%">
      <Letterbox contentAspectRatio={564 / 806} height={200} width={200}>
        <Image
          alt="Example image"
          naturalHeight={806}
          naturalWidth={564}
          src="https://i.ibb.co/jVR29XV/stock5.jpg"
        />
      </Letterbox>
    </Flex>
  );
}
