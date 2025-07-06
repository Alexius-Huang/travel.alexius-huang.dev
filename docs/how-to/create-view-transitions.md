# Create View Transitions

## What is View Transitions?
[View Transition API](https://developer.chrome.com/docs/web-platform/view-transitions) is a way to create seamless visual transitions between different views on your website. This creates a more visually engaging user experience for users as they navigate your site, regardless of whether it's built as a multi-page application (MPA) or a single-page application (SPA).

Checkout [react-router Official Doc](https://reactrouter.com/how-to/view-transitions) on implementation of the View Transition.

## Creating View Transition in this Repository

Checkout an example of implementation of View Transition between the Home page's timeline trip details link to Trip Details Page.

- Link from: `app/containers/index/trip-timeline/trip-introduction.tsx`
- Link to: `app/routes/trip-details-page.tsx` where route is `/trips/{:trip_id}`

First use the `NavLink` wrapper component in `@app/components/nav-link.tsx` and enable view transition by adding `viewTransition` property.

```tsx
<NavLink
    size="sm"
    aria-label={`Explore more about this trip: ${title}, ${subtitle}`}
    to={tripDetailsLink}
    viewTransition
>
    Explore More
</NavLink>
```

Next, make use of hook `useViewTransitionState` and pass the target link to be transitioned to:

```tsx
const tripDetailsLink = `trips/${tripId}`;
const isTransitioningToTDP = useViewTransitionState(tripDetailsLink);
```

The `isTransitioningToTDP` is a Boolean which we can apply style on the target transitioning element.

For instance, to transition the header element:

```tsx
<h3
    className="..."
    style={{
        viewTransitionName: isTransitioningToTDP
            ? 'trip-title'
            : 'none'
    }}
>
    {title}
</h3>
```

We also provides the `useViewTransition` custom hook which wraps around the `useViewTransitionState` and automatically handles the toggling of the class.

```tsx
const vt = useViewTransition(
    tripDetailsLink,
    ['trip-title', 'trip-subtitle', ...]
);

<h3 className={`... ${vt.tripTitle}`}>
    {title}
</h3>
```

Or define transition class in `@app/styles/view-transition.css` within the `@theme` declaration in TailwindCSS, so that we can apply `v-trans-[name-of-the-transition-class]:

```css
@theme {
    /* Transition to Trip Details Page */
    --v-trans-trip-title: trip-title;
    --v-trans-trip-subtitle: trip-subtitle;
    // ...
}

@utility v-trans-* {
    view-transition-name: --value(--v-trans-*);
}
```

In this case, we can use `v-trans-trip-title` for populating the CSS `view-transition-name` property.

Lastly, apply the class to the corresponding element in the target transitioned page, in this case, the Trip Details Page (`app/routes/trip-details-page.tsx`):

```tsx
<h1 className='v-trans-trip-title'>{title}</h1>
```

## Steps In Short

1. Assign the `view-transition-name` CSS property in the element to both page, whether using pure CSS inline style or creating through Tailwind utility class

2. Use `useViewTransitionState(<target-url>)` to get the transition state or simply use `useViewTransition(<target-url>, Array<view-transition-class>)`.

3. Use the transition state to toggle on/off the `view-transition-name` property in the from-transitioning page
