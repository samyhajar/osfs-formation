-- Create the formee_introduction table
CREATE TABLE public.formee_introduction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    coordinator_name TEXT NOT NULL,
    left_column_content TEXT NOT NULL,
    right_column_content TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

-- Create a trigger for the updated_at column
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.formee_introduction
FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

-- Only one row should be active at a time
CREATE OR REPLACE FUNCTION public.enforce_single_active_intro()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.active = true THEN
        UPDATE public.formee_introduction
        SET active = false
        WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_active_intro
BEFORE INSERT OR UPDATE OF active ON public.formee_introduction
FOR EACH ROW
WHEN (NEW.active = true)
EXECUTE FUNCTION public.enforce_single_active_intro();

-- Insert initial data
INSERT INTO public.formee_introduction (
    coordinator_name,
    left_column_content,
    right_column_content
) VALUES (
    'Francis W. Danella, OSFS',
    'The formation website is a resource for Oblate formators and Oblates in formation.

Origins of the Formation Coordinator

The origins of the General Formation Coordinator go back to the directive from the General Chapter of 2006 to "compile and formulate common guidelines for formation in Oblate spirituality" and the meeting of major superiors in 2007 which focused on formation. Then as now there were efforts in every province and region to offer effective formation, but the meeting also recognized there were striking differences, and an effort was made to reach greater common ground in formation throughout the congregation.',
    'Future Goals

In my capacity as the General Formation Coordinator, I want to facilitate a thoughtful exchange concerning formation in our units. I encourage all formation personnel to engage in ongoing training for their ministry.

I intend over the next several years to visit all of our houses of formation. I visited the houses of formation in India in March of 2020, but because of the pandemic I will need to reschedule my visits to the houses of formation in the French-West African Province which were due to take place in the fall of 2020.

I want to thank our formators for all that you are doing for our confreres in formation. Your ministry is critical to the ongoing growth and health of our congregation. May all of us continue in our efforts to Live Jesus and may we be a bridge to others who seek Jesus Christ.

Fraternally yours, Frank Danella, OSFS General Formation Coordinator'
);

-- Add RLS
ALTER TABLE public.formee_introduction ENABLE ROW LEVEL SECURITY;

-- Admins can read and write to the formee_introduction table
CREATE POLICY "Admins can manage formee_introduction"
ON public.formee_introduction
FOR ALL
TO authenticated
USING (is_admin());

-- All authenticated users can read the formee_introduction table
CREATE POLICY "Authenticated users can read formee_introduction"
ON public.formee_introduction
FOR SELECT
TO authenticated
USING (true);